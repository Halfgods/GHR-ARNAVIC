import cv2
import numpy as np
import heapq
import math


def heuristic(a, b):
    return math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)

def astar(grid, start, goal):
    rows, cols = grid.shape
    open_set = []
    heapq.heappush(open_set, (0, start))

    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    directions = [(-1,0),(1,0),(0,-1),(0,1),
                  (-1,-1),(-1,1),(1,-1),(1,1)]  

    while open_set:
        current = heapq.heappop(open_set)[1]

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path

        for dx, dy in directions:
            neighbor = (current[0]+dx, current[1]+dy)

            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                if grid[neighbor[0], neighbor[1]] == 255:
                    continue  

                tentative_g = g_score[current] + heuristic(current, neighbor)

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return None


points = []

def click_event(event, x, y, flags, param):
    global points, img_display

    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((y, x)) 

        cv2.circle(img_display, (x,y), 5, (0,0,255), -1)
        cv2.imshow("Map", img_display)

        if len(points) == 2:
            start, goal = points
            path = astar(grid, start, goal)

            if path:
                for p in path:
                    cv2.circle(img_display, (p[1], p[0]), 1, (255,0,0), -1)
                cv2.imshow("Map", img_display)
            else:
                print("No path found")

grid = cv2.imread("obstacle_map.png", 0)
img_display = cv2.cvtColor(grid, cv2.COLOR_GRAY2BGR)

cv2.imshow("Map", img_display)
cv2.setMouseCallback("Map", click_event)

cv2.waitKey(0)
cv2.destroyAllWindows()