"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';

export default function AddBooking() {
  const [service, setService] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service || !doctorName || !startTime || !endTime || !date) {
      setError("");
      toast.warning("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        cache: 'no-store',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ service: service, doctor_name: doctorName, start_time: startTime, end_time: endTime, date: date }),
      });

      if (res.status === 201) {
        setError("");
        router.push("/");
      } else if (res.status === 400) {
        const data = await res.json();
        setError(data.error);
      } else {
        setError("An error occurred while adding the booking.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="max-w-md w-full space-y-8">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <input
          onChange={(e) => setService(e.target.value)}
          value={service}
          className="border border-slate-300 px-4 py-2 rounded-md text-black"
          type="text"
          placeholder="Service"
        />

        <input
          onChange={(e) => setDoctorName(e.target.value)}
          value={doctorName}
          className="border border-slate-300 px-4 py-2 rounded-md text-black"
          type="text"
          placeholder="Doctor Name"
        />

        <input
          onChange={(e) => setStartTime(e.target.value)}
          value={startTime}
          className="border border-slate-300 px-4 py-2 rounded-md text-black"
          type="text"
          placeholder="Start Time"
        />

        <input
          onChange={(e) => setEndTime(e.target.value)}
          value={endTime}
          className="border border-slate-300 px-4 py-2 rounded-md text-black"
          type="text"
          placeholder="End Time"
        />

        <input
          onChange={(e) => setDate(e.target.value)}
          value={date}
          className="border border-slate-300 px-4 py-2 rounded-md text-black"
          type="text"
          placeholder="Date"
        />

        <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Add
            </button>

            <Link href="/" legacyBehavior>
              <a className="text-blue-400 hover:text-blue-300 font-bold py-2 px-4 rounded-full">Back to Home</a>
            </Link>
        </div>

      </form>
    </div>
  </div>

  );
}