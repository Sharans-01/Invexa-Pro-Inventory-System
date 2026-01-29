// import { useEffect, useState } from "react";
// import axios from "axios";

// function Dashboard() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchProtectedData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/products/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setData(res.data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchProtectedData();
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>Welcome to the Dashboard</h2>
//       {data ? (
//         <div>
//           <p>{data.message}</p>
//           <pre>{JSON.stringify(data.user, null, 2)}</pre>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default Dashboard;
