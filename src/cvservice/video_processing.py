# import libraries
import pandas as pd
import numpy as np
import cv2
import matplotlib.pyplot as plt
plt.style.use('ggplot')


from glob import glob

import IPython.display as ipd
from tqdm import tqdm

import subprocess

if __name__ == '__main__':
    # input_file = './video_processing.mp4'

    # define a video capture object
    vid = cv2.VideoCapture(0)

    while (True):

        # Capture the video frame
        # by frame
        ret, frame = vid.read()

        # Display the resulting frame
        cv2.imshow('frame', frame)
        # TODO: call the detection service here

        # the 'q' button is set as the
        # quitting button
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # After the loop release the cap object
    vid.release()
    # Destroy all the windows
    cv2.destroyAllWindows()