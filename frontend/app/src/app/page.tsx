import Link from 'next/link';

interface Booking {
    id: number;
    service: string;
    doctor_name: string;
    start_time: string;
    end_time: string;
    date: string;
}

const fetchBookings = async () => {
  const response = await fetch('http://host.docker.internal:5000/api/bookings', { cache: 'no-store', mode: 'no-cors' });
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return await response.json();
};

const HomePage = async() => {

    const bookings: Booking[] = await fetchBookings()

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-8">Bookings</h1>
        <ul className="list-disc mb-8">
          {bookings.map((booking) => (
            <li key={booking.id} className="mb-2">
              <Link href={`/booking/${booking.id}`} legacyBehavior>
                <a className="text-blue-400 hover:text-blue-300">
                  A Booking on {booking.date} starting at {booking.start_time}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/createBooking" legacyBehavior>
          <a className="px-6 py-2 bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold">
            Create Booking
          </a>
        </Link>
      </div>
    );
  };

export default HomePage;