import cv2
import numpy as np
import heapq
import math


def heuristic(a, b):
    return math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)

def check_line(grid, p1, p2):
    y1, x1 = p1
    y2, x2 = p2
    
    steps = max(abs(y2 - y1), abs(x2 - x1))
    if steps == 0:
        return True
        
    dy = (y2 - y1) / steps
    dx = (x2 - x1) / steps
    
    for i in range(1, steps + 1):
        ny = int(y1 + i * dy)
        nx = int(x1 + i * dx)
        if grid[ny, nx] == 255:
            return False
    return True

def smooth_path(grid, path):
    if not path or len(path) < 3:
        return path
        
    smoothed = [path[0]]
    current_idx = 0
    
    while current_idx < len(path) - 1:
        furthest_visible = current_idx + 1
        for i in range(len(path) - 1, current_idx + 1, -1):
            if check_line(grid, path[current_idx], path[i]):
                furthest_visible = i
                break
        
        smoothed.append(path[furthest_visible])
        current_idx = furthest_visible
        
    return smoothed

def astar(grid, start, goal):
    rows, cols = grid.shape
    open_set = []
    heapq.heappush(open_set, (0, start, (0, 0)))

    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    directions = [(-1,0),(1,0),(0,-1),(0,1),
                  (-1,-1),(-1,1),(1,-1),(1,1)]  

    while open_set:
        _, current, prev_dir = heapq.heappop(open_set)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path

        for dy, dx in directions:
            neighbor = (current[0]+dy, current[1]+dx)

            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                if grid[neighbor[0], neighbor[1]] == 255:
                    continue  

                dist = math.sqrt(dy**2 + dx**2)
                
                penalty = 0
                if prev_dir != (0, 0) and prev_dir != (dy, dx):
                    penalty = 0.5

                tentative_g = g_score[current] + dist + penalty

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor, (dy, dx)))

    return None


points = []

def click_event(event, x, y, flags, param):
    global points, img_display

    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((y, x)) 

        cv2.circle(img_display, (x,y), 5, (0,0,200), -1)
        cv2.imshow("Map", img_display)

        if len(points) == 2:
            start, goal = points
            
            if grid_with_margin[start[0], start[1]] == 255:
                print("Start point is too close to a wall, trying original grid...")
            if grid_with_margin[goal[0], goal[1]] == 255:
                print("Goal point is too close to a wall, trying original grid...")
                
            path = astar(grid_with_margin, start, goal)
            
            if not path:
                print("No path found with margin, trying without it...")
                path = astar(grid, start, goal)

            if path:
                smoothed = smooth_path(grid_with_margin, path)
                
                print("\nOptimal path sequence of turning points:")
                for i, p in enumerate(smoothed):
                    if i == 0:
                        print(f"Start: (x={p[1]}, y={p[0]})")
                    elif i == len(smoothed) - 1:
                        print(f"Goal: (x={p[1]}, y={p[0]})")
                    else:
                        print(f"Turn {i}: (x={p[1]}, y={p[0]})")

                for i in range(len(smoothed) - 1):
                    p1 = (smoothed[i][1], smoothed[i][0])
                    p2 = (smoothed[i+1][1], smoothed[i+1][0])
                    cv2.line(img_display, p1, p2, (255, 0, 0), 2)
                
                cv2.imshow("Map", img_display)
            else:
                print("No path found")

grid = cv2.imread("obstacle_map.png", 0)

kernel = np.ones((5, 5), np.uint8)
grid_with_margin = cv2.dilate(grid, kernel, iterations=2)

img_display = cv2.cvtColor(grid, cv2.COLOR_GRAY2BGR)

cv2.imshow("Map", img_display)
cv2.setMouseCallback("Map", click_event)

cv2.waitKey(0)
cv2.destroyAllWindows()
