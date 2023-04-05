# import libraries
from collections import deque
import numpy as np
import argparse
import imutils
import cv2

from glob import glob

import IPython.display as ipd
from tqdm import tqdm

import subprocess
import requests
from datetime import datetime
import json
import os
import time

if __name__ == '__main__':
    input_file = 'kids_crying.mp4'
    # input_file = 0

    args = {"classes": "action_recognition_kinetics.txt", "model": "resnet-34_kinetics.onnx", "input": input_file}

    CLASSES = open(args["classes"]).read().strip().split("\n")
    SAMPLE_DURATION = 16
    SAMPLE_SIZE = 112

    frames = deque(maxlen=SAMPLE_DURATION)

    print("[INFO] loading human activity recognition model...")
    net = cv2.dnn.readNet(args["model"])

    print("[INFO] accessing video stream...")
    vs = cv2.VideoCapture(args["input"] if args["input"] else 0)

    while True:
        (grabbed, frame) = vs.read()

        if not grabbed:
            print("[INFO] no frame read from stream - exiting")
            break

        frame = imutils.resize(frame, width=400)
        frames.append(frame)

        if len(frames) < SAMPLE_DURATION:
            continue

        blob = cv2.dnn.blobFromImages(frames, 1.0,
                                      (SAMPLE_SIZE, SAMPLE_SIZE), (114.7748, 107.7354, 99.4750),
                                      swapRB=True, crop=True)
        blob = np.transpose(blob, (1, 0, 2, 3))
        blob = np.expand_dims(blob, axis=0)

        net.setInput(blob)
        outputs = net.forward()
        outputs_sorted = np.sort(outputs, axis=None)
        print(outputs_sorted[-1], outputs_sorted[-2],)
        if outputs_sorted[-1] >= 1.3* outputs_sorted[-2]:
            label = CLASSES[np.argmax(outputs)]
            print(label)
            if label == 'crying' or label == 'jogging':
                filename = '../upload' + label + str(datetime.now()) + '.jpg'
                print(cv2.imwrite(filename, frame))
                url = 'http://3.142.235.3:3000'
                incident = {'event': label, 'date': str(datetime.now()), 'imageUrl': filename[9:] }
                x = requests.post(url, json=incident)

                header = {"Content-Type": "application/json; charset=utf-8",
                          "Authorization": "Basic NTUzZTY3MWUtNDRkMC00MTg2LWFjZmItMDIwZTlkMmNiMWFm"}

                payload = {"app_id": "9ea06b9a-1433-4c15-ba13-3e8c70a63f52",
                           "included_segments": ["Subscribed Users"],
                           "contents": {"en": "Incident Detected"}}

                req = requests.post("https://onesignal.com/api/v1/notifications", headers=header,
                                    data=json.dumps(payload))
                print("notification", req)
                time.sleep(180)
        else:
            label = ''

        cv2.rectangle(frame, (0, 0), (300, 40), (0, 0, 0), -1)
        cv2.putText(frame, label, (10, 25), cv2.FONT_HERSHEY_SIMPLEX,
                    0.8, (255, 255, 255), 2)

        cv2.imshow("Activity Recognition", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break