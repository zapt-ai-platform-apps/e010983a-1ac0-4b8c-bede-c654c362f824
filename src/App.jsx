import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Routes, Route, useNavigate } from '@solidjs/router';
import Home from './Home';
import CreateEvent from './CreateEvent';
import Profile from './Profile';

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
      >
        <Routes>
          <Route path="/home" element={<Home user={user()} />} />
          <Route path="/create-event" element={<CreateEvent user={user()} />} />
          <Route path="/profile" element={<Profile user={user()} />} />
        </Routes>
      </Show>
    </div>
  );
}

export default App;