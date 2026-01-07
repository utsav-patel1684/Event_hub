import React, { useState } from "react";
import { useEvents } from "../../Context/EventContext";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { logout } = useAuth();
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    primaryImage: "",
    galleryImages: "",
    totalSlots: "",
  });

  // Handle Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    const galleryArray = formData.galleryImages.split(",").map(url => url.trim()).filter(url => url !== "");
    const eventData = { ...formData, gallery: galleryArray, totalSlots: parseInt(formData.totalSlots) };

    try {
      await createEvent(eventData); 
      setFormData({ name: "", description: "", date: "", primaryImage: "", galleryImages: "", totalSlots: "" });
      toast.success("Event published successfully"); 
    } finally {
      setIsPublishing(false); 
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    const galleryArray = editingEvent.galleryImages?.split(",").map(url => url.trim()) || [];
    
    try {
      await updateEvent(editingEvent.id, {
        ...editingEvent,
        gallery: galleryArray,
        totalSlots: parseInt(editingEvent.totalSlots),
        remainingSlots: parseInt(editingEvent.totalSlots) 
      });
      toast.success("Event updated successfully");
      setEditingEvent(null);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    setIsDeleting(id); 
    await deleteEvent(id);
    toast.error("Event deleted successfully");
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Control Panel</h1>
          <button onClick={logout} className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold transition-all">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CREATE FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold mb-6 text-indigo-700 uppercase tracking-wider">✨ Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Event Title" className="w-full border p-3 rounded-xl outline-none focus:border-indigo-500 text-gray-500  bg-white cursor-pointer " value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="border p-3 rounded-xl outline-none" value={formData.date} onClick={(e) => e.target.showPicker()} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                <input type="number" placeholder="Slots" className="border p-3 rounded-xl outline-none" value={formData.totalSlots} onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })} required />
              </div>
              <input type="text" placeholder="Primary Image URL" className="w-full border p-3 rounded-xl outline-none" value={formData.primaryImage} onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })} required />
              <textarea placeholder="Gallery (URLs comma separated)" className="w-full border p-3 rounded-xl h-16 outline-none" value={formData.galleryImages} onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })} />
              <textarea placeholder="Description" className="w-full border p-3 rounded-xl h-24 outline-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <button disabled={isPublishing} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black disabled:bg-gray-400">
                {isPublishing ? "PUBLISHING..." : "PUBLISH EVENT"}
              </button>
            </form>
          </div>

          {/* LIST TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-400 text-xs uppercase">
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Slots</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={event.primaryImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <span className="font-bold text-gray-800">{event.name}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{event.remainingSlots}/{event.totalSlots}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      {/* ✅ EDIT BUTTON (PENCIL) */}
                      <button 
                        onClick={() => setEditingEvent({ ...event, galleryImages: event.gallery?.join(", ") })}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button onClick={() => handleDelete(event.id)} disabled={isDeleting === event.id} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        {isDeleting === event.id ? "..." : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ EDIT MODAL SECTION */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 overflow-hidden animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-6 text-gray-800">Edit Event</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" className="w-full border p-3 rounded-xl outline-none focus:border-indigo-500" value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="border p-3 rounded-xl outline-none" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} required />
                <input type="number" placeholder="Total Slots" className="border p-3 rounded-xl outline-none" value={editingEvent.totalSlots} onChange={(e) => setEditingEvent({ ...editingEvent, totalSlots: e.target.value })} required />
              </div>
              <input type="text" placeholder="Primary Image URL" className="w-full border p-3 rounded-xl outline-none" value={editingEvent.primaryImage} onChange={(e) => setEditingEvent({ ...editingEvent, primaryImage: e.target.value })} required />
              <textarea placeholder="Gallery (comma separated)" className="w-full border p-3 rounded-xl h-16 outline-none" value={editingEvent.galleryImages} onChange={(e) => setEditingEvent({ ...editingEvent, galleryImages: e.target.value })} />
              <textarea className="w-full border p-3 rounded-xl h-28 outline-none focus:border-indigo-500" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} required />
              
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-gray-100 py-4 rounded-xl font-bold text-gray-600">Cancel</button>
                <button type="submit" disabled={isPublishing} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black disabled:bg-gray-400">
                  {isPublishing ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;