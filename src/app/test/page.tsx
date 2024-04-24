"use client";
import dynamic from "next/dynamic";

import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StackedBarChart() {
  const data = [
    { round: 1, correct: 5, wrong: 2, skipped: 1 },
    { round: 2, correct: 4, wrong: 1, skipped: 3 },
    // Add more objects for each round
  ];
  // Extracting data for each category
  const rounds = data.map((item) => item.round);
  const correct = data.map((item) => item.correct);
  const wrong = data.map((item) => -item.wrong); // Counting wrong as negative
  const skipped = data.map((item) => -item.skipped); // Counting skipped as negative

  const options = {
    chart: {
      toolbar: { show: false },
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: rounds.map((round) => `Round ${round}`),
      title: {
        text: "Round",
      },
    },
    yaxis: {
      title: {
        text: "Number of Questions",
      },
    },
    colors: ["#22c55e", "#ef4444", "#64748b"], // Colors for correct, wrong, and skipped respectively
  };

  const series = [
    {
      name: "Correct",
      data: correct,
    },
    {
      name: "Wrong",
      data: wrong,
    },
    {
      name: "Skipped",
      data: skipped,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
        width={400}
      />
    </main>
  );
}
