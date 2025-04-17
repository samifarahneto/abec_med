async function createAdmin() {
  const response = await fetch("http://localhost:3000/api/setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Admin",
      email: "admin@abecmed.com",
      password: "admin123",
    }),
  });

  const data = await response.json();
  console.log("Resposta:", data);
}

createAdmin();
