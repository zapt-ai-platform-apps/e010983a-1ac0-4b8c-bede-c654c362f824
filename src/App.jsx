import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Routes, Route, useNavigate } from '@solidjs/router';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
      navigate('/home');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
        navigate('/home');
      } else {
        setUser(null);
        setCurrentPage('login');
        navigate('/');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Routes>
        <Route
          path="/"
          element={
            <Show
              when={currentPage() === 'homePage'}
              fallback={
                <div class="flex items-center justify-center h-full">
                  <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">
                      Sign in with ZAPT
                    </h2>
                    <a
                      href="https://www.zapt.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-500 hover:underline mb-6 block text-center"
                    >
                      Learn more about ZAPT
                    </a>
                    <Auth
                      supabaseClient={supabase}
                      appearance={{ theme: ThemeSupa }}
                      providers={['google', 'facebook', 'apple']}
                      magicLink={true}
                      showLinks={false}
                      view="magic_link"
                    />
                  </div>
                </div>
              }
            ></Show>
          }
        />
        <Route
          path="/home"
          element={
            <Show when={user()}>
              <Home user={user()} />
            </Show>
          }
        />
      </Routes>
    </div>
  );
}

function Home({ user }) {
  const [loading, setLoading] = createSignal(false);
  const [friends, setFriends] = createSignal([]);
  const [events, setEvents] = createSignal([]);
  const [walletBalance, setWalletBalance] = createSignal(100); // Default balance
  const [autoRefillThreshold, setAutoRefillThreshold] = createSignal(20);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
    navigate('/');
  };

  const fetchFriends = async () => {
    // Fetch friends logic
  };

  const fetchEvents = async () => {
    // Fetch events logic
  };

  onMount(() => {
    fetchFriends();
    fetchEvents();
  });

  return (
    <div class="max-w-6xl mx-auto h-full">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">New App</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="col-span-1">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Profile</h2>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="font-semibold">Name: {user.email}</p>
            <p class="mt-2">Wallet Balance: ${walletBalance().toFixed(2)}</p>
            <p class="mt-2">Auto-Refill Threshold: ${autoRefillThreshold()}</p>
            {/* Additional profile information */}
          </div>
        </div>
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Upcoming Events</h2>
          <Show
            when={events().length > 0}
            fallback={<p>No upcoming events. Create one!</p>}
          >
            <For each={events()}>
              {(event) => (
                <div class="bg-white p-6 rounded-lg shadow-md mb-4">
                  <p class="font-semibold text-lg text-purple-600 mb-2">{event.name}</p>
                  <p class="text-gray-700">
                    At {event.restaurant} on {event.date}
                  </p>
                  {/* Additional event details */}
                </div>
              )}
            </For>
          </Show>
          <button
            class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => navigate('/create-event')}
          >
            Create New Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;