/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.fcfs;

/**
 *
 * @author Hager Elhawary
 */
import java .util.Scanner;


public class Fcfs {

    public static void main(String[] args) {
   
      Scanner scanner = new Scanner(System.in);

        // Input number of processes
        int n;
        do {
            System.out.print("Enter the number of processes: ");
            while (!scanner.hasNextInt()) {
                System.out.println("Invalid input. enter a positive integer.");
                scanner.next(); 
            }
            n = scanner.nextInt();
            if (n <= 0) {
                System.out.println("The number of processescan't be negative.");
            }
        } while (n <= 0);

        //2D array  {Process number   Arrival time   Burst time   Completion time   Turnaround time   Waiting time   Idle time}
        int[][] processes = new int[n][7]; //

        // Input arrival times, burst times + validate.
        for (int i = 0; i < n; i++) {
            processes[i][0] = i + 1; // process number
            System.out.printf("For process %d: ", i + 1 );
            System.out.println("");
            int arrivalTime;
            do {
                System.out.println("Enter arrival time:");
                while (!scanner.hasNextInt()) {
                    System.out.println("Invalid input. enter a postive integer.");
                    scanner.next(); 
                }
                arrivalTime = scanner.nextInt();
                if (arrivalTime < 0) {
                    System.out.println("Arrival time can't be negative.");
                }
            } while (arrivalTime < 0);
            processes[i][1] = arrivalTime;

            
            int burstTime;
            do {
                System.out.println("Enter burst time:");
                while (!scanner.hasNextInt()) {
                    System.out.println("Invalid input. Enter a positive integer.");
                    scanner.next();
                }
                burstTime = scanner.nextInt();
                if (burstTime <= 0) {
                    System.out.println("Burst time can't be negative.");
                }
            } while (burstTime <= 0);
            processes[i][2] = burstTime;
        }

        // Sort processes by arrival time
        bSort(processes);

        //fcfs calculation table.
        calculateFCFS(processes, n);

        scanner.close();
    }
     public static void bSort(int[][] processes) {
        int n = processes.length;

        // bubble sort to take the arrival time into consideration.
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                // Compare arrival times
                if (processes[j][1] > processes[j + 1][1]) {
                    // Swap the rows if not orderd 
                    int[] temp = processes[j];
                    processes[j] = processes[j + 1];
                    processes[j + 1] = temp;
                }
            }
        }
    }

public static void calculateFCFS(int[][] processes, int n) {
    int cumulativeTime = 0; // current time in the cpu
    int totalWaitingTime = 0; // fum of waiting times
    int totalTurnaroundTime = 0; // Sum of turnaround times
    int totalIdleTime = 0; // total idle time

    System.out.println("Process number   Arrival time   Burst time   Completion time   Turnaround time   Waiting time   Idle time");
    System.out.println("-----------------------------------------------------------------------------------------------");

    for (int i = 0; i < n; i++) {
        int processNum = processes[i][0];
        int arrivalTime = processes[i][1];
        int burstTime = processes[i][2];

        // start time
        int startTime = Math.max(arrivalTime, cumulativeTime);

       
        int idleTime = 0;
        if (arrivalTime > cumulativeTime) {
            idleTime = arrivalTime - cumulativeTime;
            totalIdleTime += idleTime; 
        }

        // calculate completion time
        cumulativeTime = startTime + burstTime;
        int completionTime = cumulativeTime;
        processes[i][3] = completionTime; // Store completion time 

        // waiting time
        int waitingTime = startTime - arrivalTime;
        totalWaitingTime += waitingTime;
        processes[i][5] = waitingTime; // Store waiting time 

        // turnaround time
        int turnaroundTime = completionTime - arrivalTime;
        totalTurnaroundTime += turnaroundTime;
        processes[i][4] = turnaroundTime; // Store turnaround time 

        // store idle 
        processes[i][6] = idleTime;

        // print process details
        System.out.printf("%-15d%-15d%-12d%-17d%-18d%-15d%-10d%n",
            processNum, arrivalTime, burstTime, completionTime, turnaroundTime, waitingTime, idleTime);
    }

    // print average waiting time and turnaround time
    System.out.println("-----------------------------------------------------------------------------------------------");
    System.out.printf("Average Waiting Time: %.2f%n", (double) totalWaitingTime / n);
    System.out.printf("Average Turnaround Time: %.2f%n", (double) totalTurnaroundTime / n);
    System.out.printf("Total Idle Time: %d%n", totalIdleTime);
}



}
    
