#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
#define MAX 10000001
struct Process {
    int pid;
    int arrival_time;
    int burst_time;
};



bool compare_burst_time(const Process& a, const Process& b) {
    return a.burst_time < b.burst_time;
}
void sjf(vector<Process> proc,int n) {


    Process first_proc;
    int count = 0;
    int test_at = proc[0].arrival_time;
    for (int i = 0; i < n; i++) {
        if (proc[i].arrival_time == test_at) {
            count++;
        }
    }
    if (count == n) {
        int ct = 0, bt = MAX;
        int total_wt = 0;
        int total_tat = 0;
        int wt = 0;
        int tat = 0;
        int indx = -1;
        sort(proc.begin(), proc.end(), compare_burst_time);
        first_proc = proc[0];
        if (first_proc.arrival_time != 0) {
            cout << "idle time :" << test_at << endl;
        }
        ct += first_proc.burst_time * 2;
        wt = 0;
        tat = first_proc.burst_time;
        total_tat += tat;
        cout << "process" << first_proc.pid << ": Waiting time: " << wt << " TAT: " << tat << " Current Time:" << ct
             << endl;
        proc.erase(proc.begin() + indx);
        while (!proc.empty()) {
            ct += proc[0].burst_time;
            tat = ct - proc[0].arrival_time;
            wt = tat - proc[0].burst_time;
            total_tat += tat;
            total_wt += wt;
            cout << "process" << proc[0].pid << ": Waiting time: " << wt << " TAT: " << tat << " Current Time:" << ct
                 << endl;
            proc.erase(proc.begin());
        }
        cout << "Average Waiting Time: " << total_wt / n << endl;
        cout << "Average Turn Around Time: " << total_tat / n << endl;
    } else {
        sort(proc.begin(), proc.end(), compare_burst_time);
        int ct = 0; 
        int total_wt = 0, total_tat = 0; 

        while (!proc.empty()) {
            int bt = INT_MAX;
            int indx = -1;
            Process selected_proc;
            bool process_found = false;

            for (int i = 0; i < proc.size(); i++) {
                if (proc[i].arrival_time <= ct && proc[i].burst_time < bt) {
                    bt = proc[i].burst_time;
                    indx = i;
                    selected_proc = proc[i];
                    process_found = true;
                }
            }

            if (!process_found) {
                cout << "CPU is idle at time: " << ct << endl;
                ct++; 
                continue;
            }

            ct += selected_proc.burst_time; 
            int tat = ct - selected_proc.arrival_time; 
            int wt = tat - selected_proc.burst_time;   

            total_tat += tat;
            total_wt += wt;
            cout << "Process " << selected_proc.pid << ": Waiting Time: " << wt
                 << ", Turnaround Time: " << tat << ", Completion Time: " << ct << endl;
            proc.erase(proc.begin() + indx);
        }
        cout << "Average Waiting Time: " << total_wt / n << endl;
        cout << "Average Turnaround Time: " << total_tat / n << endl;
    }


}
int main() {
    int n;
    cout << "Enter the number of processes: ";
    cin >> n;

    vector<Process> processes(n);

    for (int i = 0; i < n; ++i) {
        processes[i].pid = i + 1;
        cout << "Enter arrival time for process " << i + 1 << ": ";
        cin >> processes[i].arrival_time;
        cout << "Enter burst time for process " << i + 1 << ": ";
        cin >> processes[i].burst_time;
    }

    sjf(processes,n);

    return 0;
}