// ADMIN: Add a new entry to leases each time a lease is approved.
// Only record acreage — no investor names.
// NEVER change TOTAL_ACRES.

const estate = {
  name: "Kyenjojo Coffee Estate",
  location: "Kyenjojo District, Uganda",
  altitude: "1,200 – 1,700m",
  rainfall: "1,300 – 1,600mm",
  soil: "Volcanic Loam",
  coordinates: { lat: 0.6167, lng: 30.6167 },
  TOTAL_ACRES: 3000
}

const leases = [
  { acres: 20 },
  { acres: 15 },
  { acres: 10 },
]

module.exports = { estate, leases }
