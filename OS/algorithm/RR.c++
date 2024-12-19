#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

// Structure to represent a process
struct Process {
    int pid;          
    int arrivalTime;   
    int burstTime;      
    int remainingTime; 
    int waitingTime;   
    int turnAroundTime; 
};

void roundRobinWithIAT(vector<Process>& processes, int quantum) {
    int n = processes.size();
    int currentTime = 0;
    queue<int> readyQueue;


    sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrivalTime < b.arrivalTime;
    });

    int index = 0; 
    while (!readyQueue.empty() || index < n) {
 
        while (index < n && processes[index].arrivalTime <= currentTime) {
            readyQueue.push(index);
            index++;
        }

        if (readyQueue.empty()) {

            currentTime = processes[index].arrivalTime;
            continue;
        }

        int idx = readyQueue.front();
        readyQueue.pop();

        if (processes[idx].remainingTime > quantum) {
            currentTime += quantum;
            processes[idx].remainingTime -= quantum;


            while (index < n && processes[index].arrivalTime <= currentTime) {
                readyQueue.push(index);
                index++;
            }

            readyQueue.push(idx); 
        } else {
            currentTime += processes[idx].remainingTime;
            processes[idx].remainingTime = 0;
            processes[idx].turnAroundTime = currentTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnAroundTime - processes[idx].burstTime;
        }
    }
}

void printResults(const vector<Process>& processes) {
    int totalWaitingTime = 0, totalTurnAroundTime = 0;

    cout << "PID\tArrival Time\tBurst Time\tWaiting Time\tTurnaround Time\n";
    for (const auto& p : processes) {
        cout << p.pid << "\t" << p.arrivalTime << "\t\t" << p.burstTime << "\t\t"
             << p.waitingTime << "\t\t" << p.turnAroundTime << endl;
        totalWaitingTime += p.waitingTime;
        totalTurnAroundTime += p.turnAroundTime;
    }

    cout << "Average Waiting Time: " << (float)totalWaitingTime / processes.size() << endl;
    cout << "Average Turnaround Time: " << (float)totalTurnAroundTime / processes.size() << endl;
}

int main() {
    int n, quantum;

    cout << "Enter the number of processes: ";
    cin >> n;

    vector<Process> processes(n);

    for (int i = 0; i < n; i++) {
        processes[i].pid = i + 1;
        cout << "Enter arrival time for process " << processes[i].pid << ": ";
        cin >> processes[i].arrivalTime;
        cout << "Enter burst time for process " << processes[i].pid << ": ";
        cin >> processes[i].burstTime;
        processes[i].remainingTime = processes[i].burstTime; 
    }

    cout << "Enter time quantum: ";
    cin >> quantum;

    roundRobinWithIAT(processes, quantum);
    printResults(processes);

    return 0;
}