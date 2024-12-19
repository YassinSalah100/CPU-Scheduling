#include <iostream>
#include <vector>
#include <iomanip> // For setprecision
#include <algorithm> // for using std::swap

using namespace std;

// Function to sort processes by arrival time
void bSort(vector<vector<int>>& processes) {
  int n = processes.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (processes[j][1] > processes[j + 1][1]) {
          swap(processes[j], processes[j + 1]);
      }
    }
  }
}

// Function to calculate and print FCFS scheduling details
void calculateFCFS(vector<vector<int>>& processes, int n) {
  int cumulativeTime = 0;
  int totalWaitingTime = 0;
  int totalTurnaroundTime = 0;
  int totalIdleTime = 0;

  cout << "Process number   Arrival time   Burst time   Completion time   Turnaround time   Waiting time   Idle time" << endl;
  cout << "-----------------------------------------------------------------------------------------------" << endl;

  for (int i = 0; i < n; i++) {
    int processNum = processes[i][0];
    int arrivalTime = processes[i][1];
    int burstTime = processes[i][2];

    int startTime = max(arrivalTime, cumulativeTime);
    int idleTime = 0;
    if (arrivalTime > cumulativeTime) {
       idleTime = arrivalTime - cumulativeTime;
       totalIdleTime += idleTime;
    }
    cumulativeTime = startTime + burstTime;
    int completionTime = cumulativeTime;
    processes[i][3] = completionTime;

    int waitingTime = startTime - arrivalTime;
    totalWaitingTime += waitingTime;
    processes[i][5] = waitingTime;
    
    int turnaroundTime = completionTime - arrivalTime;
    totalTurnaroundTime += turnaroundTime;
    processes[i][4] = turnaroundTime;
    
     processes[i][6] = idleTime;

    cout << setw(15) << processNum << setw(15) << arrivalTime << setw(12) << burstTime
         << setw(17) << completionTime << setw(18) << turnaroundTime << setw(15)
         << waitingTime << setw(10) << idleTime << endl;
  }
   cout << "-----------------------------------------------------------------------------------------------" << endl;
  cout << "Average Waiting Time: " << fixed << setprecision(2) << (double)totalWaitingTime / n << endl;
  cout << "Average Turnaround Time: " << fixed << setprecision(2) << (double)totalTurnaroundTime / n << endl;
  cout << "Total Idle Time: " << totalIdleTime << endl;
}

int main() {
  int n;
  do {
    cout << "Enter the number of processes: ";
    while (!(cin >> n)) {
      cout << "Invalid input. Enter a positive integer." << endl;
      cin.clear();
      cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
    if (n <= 0) {
      cout << "The number of processes can't be negative." << endl;
    }
  } while (n <= 0);
  
  vector<vector<int>> processes(n, vector<int>(7));

  for (int i = 0; i < n; i++) {
        processes[i][0] = i + 1; // Process number
        cout << "For process " << i + 1 << ":" << endl;
        int arrivalTime;
            do {
                cout << "Enter arrival time:";
                while (!(cin >> arrivalTime)) {
                    cout << "Invalid input. Enter a postive integer." << endl;
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                }
                if (arrivalTime < 0) {
                    cout << "Arrival time can't be negative." << endl;
                }
            } while (arrivalTime < 0);
        processes[i][1] = arrivalTime;

        int burstTime;
            do {
               cout << "Enter burst time:";
               while (!(cin >> burstTime)) {
                  cout << "Invalid input. Enter a positive integer." << endl;
                  cin.clear();
                   cin.ignore(numeric_limits<streamsize>::max(), '\n');
                }
                 if (burstTime <= 0) {
                    cout << "Burst time can't be negative." << endl;
                  }
                 } while (burstTime <= 0);
           processes[i][2] = burstTime;
    }

  bSort(processes);
  calculateFCFS(processes, n);
  
  return 0;
}