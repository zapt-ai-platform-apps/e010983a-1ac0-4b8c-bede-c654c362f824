import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from './supabaseClient';

function CreateEvent({ user }) {
  const [eventData, setEventData] = createSignal({
    name: '',
    category: '',
    venue: '',
    date: '',
    invitedFriends: [],
  });
  const [friends, setFriends] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const categories = ['Food', 'Entertainment', 'Ride Share', 'Shopping'];

  const fetchFriends = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Fetch user's friends from the backend (Assuming an API endpoint exists)
      const response = await fetch('/api/getFriends', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
      } else {
        console.error('Error fetching friends');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/createEvent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData()),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Event created:', data.event);
        navigate('/home');
      } else {
        console.error('Error creating event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFriendSelection = (friendId) => {
    let invited = eventData().invitedFriends.slice();
    if (invited.includes(friendId)) {
      invited = invited.filter((id) => id !== friendId);
    } else {
      invited.push(friendId);
    }
    setEventData({ ...eventData(), invitedFriends: invited });
  };

  onMount(() => {
    fetchFriends();
  });

  return (
    <div class="max-w-md mx-auto h-full">
      <h2 class="text-2xl font-bold mb-6 text-purple-600 text-center">Create New Event</h2>
      <form onSubmit={handleCreateEvent} class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Event Name</label>
          <input
            type="text"
            value={eventData().name}
            onInput={(e) => setEventData({ ...eventData(), name: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={eventData().category}
            onChange={(e) => setEventData({ ...eventData(), category: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          >
            <option value="" disabled>Select a category</option>
            <For each={categories}>
              {(category) => (
                <option value={category}>{category}</option>
              )}
            </For>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Venue</label>
          <input
            type="text"
            value={eventData().venue}
            onInput={(e) => setEventData({ ...eventData(), venue: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Date & Time</label>
          <input
            type="datetime-local"
            value={eventData().date}
            onInput={(e) => setEventData({ ...eventData(), date: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Invite Friends</label>
          <div class="max-h-32 overflow-y-auto">
            <For each={friends()}>
              {(friend) => (
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    checked={eventData().invitedFriends.includes(friend.id)}
                    onChange={() => toggleFriendSelection(friend.id)}
                    class="mr-2 cursor-pointer"
                  />
                  <span>{friend.name}</span>
                </div>
              )}
            </For>
          </div>
        </div>
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          {loading() ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;