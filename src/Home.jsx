import { createSignal, onMount, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from './supabaseClient';

function Home({ user }) {
  const [loading, setLoading] = createSignal(false);
  const [events, setEvents] = createSignal([]);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getEvents', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error('Error fetching events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchEvents();
  });

  return (
    <div class="max-w-6xl mx-auto h-full">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600 cursor-pointer" onClick={() => navigate('/home')}>
          New App
        </h1>
        <div>
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mr-4"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="col-span-1">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Welcome, {user.email}</h2>
          <button
            class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => navigate('/create-event')}
          >
            Create New Event
          </button>
        </div>
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Upcoming Events</h2>
          <Show
            when={loading()}
            fallback={
              <Show when={events().length > 0} fallback={<p>No upcoming events. Create one!</p>}>
                <For each={events()}>
                  {(event) => (
                    <div class="bg-white p-6 rounded-lg shadow-md mb-4">
                      <p class="font-semibold text-lg text-purple-600 mb-2">{event.events.name}</p>
                      <p class="text-gray-700">
                        Category: {event.events.category}
                        <br />
                        Venue: {event.events.venue}
                        <br />
                        Date: {new Date(event.events.date).toLocaleString()}
                      </p>
                    </div>
                  )}
                </For>
              </Show>
            }
          >
            <p>Loading events...</p>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default Home;