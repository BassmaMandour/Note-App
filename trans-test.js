import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 20, // virtual users
  duration: '1m', // test duration
};

export default function () {
  // 1. Load the home page
  let res1 = http.get('http://localhost:5000/');
  check(res1, {
    'home page status is 200': (r) => r.status === 200,
  });

  // 2. Add a note
  let payload = 'note=TestNoteFromK6';
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  let res2 = http.post('http://localhost:5000/notes', payload, { headers });
  check(res2, {
    'note added (redirect)': (r) => r.status === 200 || r.status === 302,
  });

  // 3. Reload homepage to verify note exists (basic flow)
  let res3 = http.get('http://localhost:5000/');
  check(res3, {
    'homepage reloaded': (r) => r.status === 200,
  });

  // 4. Delete note (simulate first note deletion)
  let res4 = http.post('http://localhost:5000/notes/0/delete');
  check(res4, {
    'note deleted (redirect)': (r) => r.status === 200 || r.status === 302,
  });

  sleep(1); // Pause between iterations
}
