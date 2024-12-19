#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <iomanip> 

using namespace std;
struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int waiting_time;
    int turnaround_time;
};
bool compare_burst_time(const Process& process1, const Process& process2) {
    return process1.arrival_time < process2.arrival_time;
}


void calculate_times(vector<Process>& processes) {
    int total_waiting_time = 0;
    int turnaround_time = 0;
    int n = processes.size();
    processes[0].waiting_time = 0;
    for (size_t i = 1; i < processes.size(); i++) {
      processes[i].waiting_time = processes[i - 1].waiting_time + processes[i - 1].burst_time;
    }
    for(size_t i = 0; i < processes.size(); i++) {
      processes[i].turnaround_time = processes[i].waiting_time + processes[i].burst_time;
      total_waiting_time += processes[i].waiting_time;
      turnaround_time += processes[i].turnaround_time;
    }
    cout << "\nProcess\tBurst Time\tWaiting Time\tTurnaround Time\n";
    for (const auto& process : processes) {
        cout << "P" << process.pid << "\t\t" << process.burst_time << "\t\t" << process.waiting_time << "\t\t" << process.turnaround_time << endl;
    }

    cout << "\nAverage Waiting Time: " << (float)total_waiting_time / processes.size() << endl;
    cout << "Average Turnaround Time: " << (float)turnaround_time / processes.size() << endl;         
}

int main() {
    int n;
    cout << "Enter the number of processes: ";
    cin >> n;
    vector<Process> processes(n);
    cout << "Enter the burst time for each process:\n";
    for (int i = 0; i < n; i++) {
        processes[i].pid = i + 1;
        cout << "P" << (i + 1) << ": ";
        cin >> processes[i].burst_time;
    }
    sort(processes.begin(), processes.end(), compare_burst_time);
    calculate_times(processes);
    return 0;
}


