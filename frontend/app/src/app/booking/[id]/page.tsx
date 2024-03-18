import React from 'react';
import Link from 'next/link';

interface Booking {
  id: number;
  service: string;
  doctor_name: string;
  start_time: string;
  end_time: string;
  date: string;
}

const fetchBookingById = async (id: string) => {
  const response = await fetch(`http://host.docker.internal:5000/api/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return await response.json();
};

const BookingDetailsPage = async ({ params }: { params: { id: string } }) => {
  const booking: Booking = await fetchBookingById(params.id)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
      <div className="max-w-md w-full space-y-8">
        <p className="text-lg">This Booking is with {booking.doctor_name} For {booking.service} and it ends on {booking.end_time}</p>
        <Link href={'/'} legacyBehavior>
          <a className="text-blue-400 hover:text-blue-300">Back</a>
        </Link>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
