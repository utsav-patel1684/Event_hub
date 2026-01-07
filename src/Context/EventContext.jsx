import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (savedEvents) {
      setEvents(savedEvents);
    }
  }, []);

  const syncStorage = (data) => {
    setEvents(data);
    localStorage.setItem("events", JSON.stringify(data));
  };

  // CREATE EVENT (Admin)
  const createEvent = (eventData) => {
    return new Promise((resolve) => {
      setLoading(true); 
      setTimeout(() => {
        const newEvent = {
          id: Date.now(),
          ...eventData,
          gallery: eventData.gallery || [], // Multiple images array
          totalSlots: Number(eventData.totalSlots),
          remainingSlots: Number(eventData.totalSlots),
        };
        const updatedEvents = [...events, newEvent];
        syncStorage(updatedEvents);
        setLoading(false); // Dummy loader stop
        resolve();
      }, 1500); // 1.5s simulated API delay
    });
  };

  // UPDATE EVENT (Admin)
  const updateEvent = (id, updatedData) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const updatedEvents = events.map((event) =>
          event.id === id ? { ...event, ...updatedData } : event
        );
        syncStorage(updatedEvents);
        setLoading(false);
        resolve();
      }, 1500);
    });
  };

  // DELETE EVENT (Admin)
  const deleteEvent = (id) => {
    return new Promise((resolve) => {
      setLoading(true); 
      setTimeout(() => {
        const filteredEvents = events.filter((event) => event.id !== id);
        syncStorage(filteredEvents);
        setLoading(false);
        resolve();
      }, 1200);
    });
  };

  // BOOK EVENT (User)
  const bookEvent = (eventId) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        let isSuccess = false;
        const updatedEvents = events.map((event) => {
          if (event.id === eventId) {
            if (event.remainingSlots > 0) {
              isSuccess = true;
              return { ...event, remainingSlots: event.remainingSlots - 1 };
            }
          }
          return event;
        });

        if (isSuccess) {
          syncStorage(updatedEvents);
          setLoading(false);
          resolve(true); 
        } else {
          setLoading(false);
          toast.error("Sorry, no slots left!");
          resolve(false); // No slots available
        }
      }, 1000); // Simulated delay for booking
    });
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        createEvent,
        updateEvent,
        deleteEvent,
        bookEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);