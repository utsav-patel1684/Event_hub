import React, { useState } from "react"; // Added useState
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../../Context/EventContext";

const EventDetails = () => {
  const { id } = useParams();
  const { events, bookEvent } = useEvents(); 
  const navigate = useNavigate();

  // 1. Local state to handle loading for ONLY this specific component
  const [isBooking, setIsBooking] = useState(false);

  // Find the specific event by ID
  const event = events.find((e) => e.id === parseInt(id) || e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Event not found!</h2>
        <button 
          onClick={() => navigate("/events")}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Events
        </button>
      </div>
    );
  }

  // 2. Updated Booking handler with local loading logic
  const handleBooking = async () => {
    setIsBooking(true);
    try {
      await bookEvent(event.id); // Wait for the context function to finish
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false); // Turn off loading only for this card
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TOP NAVIGATION */}
      <nav className="p-6">
        <button 
          onClick={() => navigate("/events")}
          className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 transition font-medium"
        >
          ← Back to All Events
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: IMAGE */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[550px]">
            <img 
              src={event.primaryImage} 
              alt={event.name} 
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = "https://via.placeholder.com/600x800?text=No+Image+Available"}
            />
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                📅 {event.date}
              </span>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                event.remainingSlots > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {event.remainingSlots > 0 ? `🔥 ${event.remainingSlots} Slots Left` : "🚫 Sold Out"}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {event.name}
            </h1>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-2">About this event</h3>
              <p className="text-gray-600 leading-relaxed italic">
                "{event.description}"
              </p>
            </div>

            {/* SLOTS INFO CARD */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-100 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Capacity</p>
                <p className="text-xl font-bold text-gray-800">{event.totalSlots}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400 uppercase font-bold">Remaining</p>
                <p className={`text-xl font-bold ${event.remainingSlots > 0 ? "text-indigo-600" : "text-red-500"}`}>
                  {event.remainingSlots}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* BOOKING BUTTON - Now using isBooking local state */}
              <button 
                onClick={handleBooking}
                disabled={isBooking || event.remainingSlots <= 0}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-gray-300 disabled:shadow-none"
              >
                {isBooking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : event.remainingSlots > 0 ? "Book My Spot Now" : "Currently Full"}
              </button>

              <button 
                onClick={() => window.print()} 
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-2xl font-bold hover:bg-gray-200 transition text-center"
              >
                Print Event Ticket Info
              </button>
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center underline underline-offset-8 decoration-indigo-200">
            Event Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-2xl overflow-hidden group">
                 <img 
                   src={`https://picsum.photos/seed/${event.id + i}/600/600`} 
                   alt="gallery" 
                   className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                 />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-gray-100 text-center text-gray-400 text-sm uppercase tracking-widest">
        © 2026 EventHub Inc.
      </footer>
    </div>
  );
};

export default EventDetails;