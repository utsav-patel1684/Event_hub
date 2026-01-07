import React, { useState } from "react";
import { useEvents } from "../../Context/EventContext";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Events = () => {
  const { events, bookEvent, loading } = useEvents();
  const { logout } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const handleBooking = async (id) => {
    setBookingId(id);
    const success = await bookEvent(id);
    if (success) {
      toast.success("Booking Successful! 🎉");
    }
    setBookingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">EVENTHUB</h1>
        <button onClick={logout} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">
          Logout
        </button>
      </nav>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Events</h2>
            <p className="text-gray-500 font-medium">Explore and book your next experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={event.primaryImage} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => e.target.src="https://via.placeholder.com/400x250"}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                  {event.remainingSlots} LEFT
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">{event.date}</p>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-1">{event.name}</h3>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBooking(event.id)}
                    disabled={loading || event.remainingSlots === 0}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:bg-gray-300 transition-all active:scale-95"
                  >
                    {bookingId === event.id ? "BOOKING..." : event.remainingSlots === 0 ? "SOLD OUT" : "BOOK NOW"}
                  </button>
                  <button onClick={() => setSelectedEvent(event)} className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- GALLERY MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="relative h-64">
              <img src={selectedEvent.primaryImage} className="w-full h-full object-cover" alt="Event" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-5 right-5 bg-white text-black p-2 rounded-full shadow-xl hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedEvent.name}</h2>
                <div className="text-right">
                    <p className="text-indigo-600 font-black text-lg">{selectedEvent.remainingSlots} / {selectedEvent.totalSlots}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Available Slots</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed font-medium">{selectedEvent.description}</p>

              {/* GALLERY GRID */}
              {selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Event Gallery</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedEvent.gallery.map((img, index) => (
                      <img key={index} src={img} className="w-24 h-24 rounded-2xl object-cover border border-gray-100 flex-shrink-0" />
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => { handleBooking(selectedEvent.id); setSelectedEvent(null); }}
                disabled={loading || selectedEvent.remainingSlots === 0}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 uppercase tracking-widest"
              >
                {loading ? "PROCESSING..." : selectedEvent.remainingSlots === 0 ? "SOLD OUT" : "CONFIRM BOOKING"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;