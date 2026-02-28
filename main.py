import cv2
import numpy as np

img = cv2.imread("blueprint.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
binary = cv2.adaptiveThreshold(
    gray,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY_INV,
    15,
    5
)
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary)

clean = np.zeros_like(binary)

for i in range(1, num_labels):
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 1000:   # threshold – adjust depending on image
        clean[labels == i] = 255

kernel = np.ones((5,5), np.uint8)
walls = cv2.morphologyEx(clean, cv2.MORPH_CLOSE, kernel)
obstacle_map = (walls > 0).astype(np.uint8)
cv2.imwrite("obstacle_map.png", obstacle_map * 255)
cv2.imshow("Obstacle Map", obstacle_map * 255)
cv2.waitKey(0)
cv2.destroyAllWindows()