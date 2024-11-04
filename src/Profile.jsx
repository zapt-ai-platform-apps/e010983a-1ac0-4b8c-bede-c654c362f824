import { createSignal, onMount } from 'solid-js';
import { supabase } from './supabaseClient';
import { useNavigate } from '@solidjs/router';

function Profile({ user }) {
  const [profileData, setProfileData] = createSignal({
    dietaryPreference: '',
    alcoholPreference: false,
  });
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/getProfile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          dietaryPreference: data.profile.dietaryPreference || '',
          alcoholPreference: data.profile.alcoholPreference || false,
        });
      } else {
        console.error('Error fetching profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData()),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        navigate('/home');
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchProfile();
  });

  return (
    <div class="max-w-md mx-auto h-full">
      <h2 class="text-2xl font-bold mb-6 text-purple-600 text-center">Your Profile</h2>
      <form onSubmit={updateProfile} class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Dietary Preference</label>
          <select
            value={profileData().dietaryPreference}
            onChange={(e) => setProfileData({ ...profileData(), dietaryPreference: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          >
            <option value="" disabled>Select a preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Alcohol Preference</label>
          <div class="flex items-center">
            <input
              type="checkbox"
              checked={profileData().alcoholPreference}
              onChange={(e) => setProfileData({ ...profileData(), alcoholPreference: e.target.checked })}
              class="mr-2 cursor-pointer"
            />
            <span>Consumes Alcohol</span>
          </div>
        </div>
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          {loading() ? 'Updating Profile...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;