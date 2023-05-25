import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { th } from 'date-fns/locale';
import { map } from 'rxjs';
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  @ViewChild('webcamVideo') webcamVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  private servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  private pc = new RTCPeerConnection(this.servers);
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callDoc: any;
  private offerCandidates: AngularFirestoreCollection<any> | null = null;
  private answerCandidates: AngularFirestoreCollection<any> | null = null;
  public hangupDisabled = true;
  public callDisabled = false;
  public answerDisabled = true;
  public webcamDisabled = false;
  public callId = '';
  public meetingId: string;
  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.route.queryParams.subscribe((val) => {
      this.meetingId = val['id'];
    });
  }

  ngOnInit(): void {
    this.pc.oniceconnectionstatechange = (event) => {
      if (this.pc.iceConnectionState === 'connected') {
        // local and remote sides are connected
        console.log('connected');
      } else {
        console.log('not connected');
      }
    };

    this.startWebcam().then(() => {
      this.afs
        .collection('bookings')
        .doc(this.meetingId)
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data() as { joined: boolean };
            const joined = data.joined;
            if (joined == false) {
              this.makeCall();
              const bookingRef = this.afs
                .collection('bookings')
                .doc(this.meetingId);

              bookingRef
                .update({ joined: true })
                .then(() => {
                  console.log('Booking joined successfully!');
                })
                .catch((error) => {
                  console.error('Error joining booking: ', error);
                });
            } else {
              this.answerCall();
            }
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document: ', error);
        });
    });
  }

  public async startWebcam() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        this.remoteStream = new MediaStream();

        // Push tracks from local stream to peer connection
        this.localStream.getTracks().forEach((track) => {
          this.pc.addTrack(track, this.localStream!);
        });

        // Pull tracks from remote stream, add to video stream
        this.pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            this.remoteStream!.addTrack(track);
          });
        };

        this.webcamVideo.nativeElement.srcObject = this.localStream;
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;

        this.callDisabled = false;
        this.answerDisabled = false;
        this.webcamDisabled = true;
      } else {
        console.error('getUserMedia not supported');
      }
    } catch (e) {
      console.error('Could not start webcam', e);
    }
  }

  public async makeCall() {
    // Reference Firestore collections for signaling
    this.callDoc = this.afs.collection('calls').doc(this.meetingId);
    this.offerCandidates = this.callDoc.collection('offerCandidates');
    this.answerCandidates = this.callDoc.collection('answerCandidates');

    this.callId = this.callDoc.ref.id;

    // Get candidates for caller, save to db
    this.pc.onicecandidate = (event) => {
      event.candidate && this.offerCandidates!.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await this.pc.createOffer();
    console.log('Offer SDP description: ', offerDescription);
    console.log('Offer SDP description: ', offerDescription.sdp);
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await this.callDoc.set({ offer });

    // Listen for remote answer
    this.callDoc.valueChanges().subscribe((callData: any) => {
      const answerDescription = callData.answer;
      if (answerDescription) {
        this.pc.setRemoteDescription(
          new RTCSessionDescription(answerDescription)
        );
      }
    });

    // Listen for remote ICE candidates
    this.answerCandidates!.snapshotChanges().subscribe((snapshot) => {
      snapshot.forEach((change) => {
        if (change.type === 'added') {
          const data = change.payload.doc.data();
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    this.hangupDisabled = false;
  }

  public async answerCall() {
    const callId = this.meetingId;
    const callDoc = this.afs.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');

    this.pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get().toPromise()).data() as {
      offer: RTCSessionDescriptionInit;
    };
    const offerDescription = callData.offer;
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await this.pc.createAnswer();
    console.log('Answer SDP description: ', answerDescription.sdp);
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.snapshotChanges().subscribe((snapshot) => {
      snapshot.forEach((change) => {
        console.log(change);
        if (change.type === 'added') {
          const data = change.payload.doc.data();
          console.log(data);
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    this.hangupDisabled = false;
  }

  public hangup() {
    this.pc.close();
    console.log(this.meetingId);
    const callId = this.meetingId;
    const callDocRef = this.afs.collection('calls').doc(callId);
    callDocRef
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });

    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });

    this.localStream = null;
    this.remoteStream = null;

    this.hangupDisabled = true;
    this.callDisabled = true;
    this.answerDisabled = true;
    this.webcamDisabled = true;
    this.router.navigate(['/userboard']);
  }
}
