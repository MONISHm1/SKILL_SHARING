import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MarkerClusterGroup from "react-leaflet-cluster";
import SkillCard from "../components/SkillCard";


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


const getCoords = skill => {
  let coords = null;


  if (
    skill.coordinates &&
    Array.isArray(skill.coordinates.coordinates) &&
    skill.coordinates.coordinates.length === 2
  ) {
    coords = skill.coordinates.coordinates;
  }

  
  else if (typeof skill.location === "string" && skill.location.includes(",")) {
    const parts = skill.location.split(",");

    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());

      if (!isNaN(lat) && !isNaN(lng)) {
        coords = [lng, lat];
      }
    }
  }

  return coords;
};


function MapController({ selectedSkill }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSkill) return;

    const coords = getCoords(selectedSkill);
    if (!coords) return;

    map.setView([coords[1], coords[0]], 16);
  }, [selectedSkill, map]);

  return null;
}


const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



function Nearby() {
  const [position, setPosition] = useState(null);
  const [skills, setSkills] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchNearby(latitude, longitude);
      },
      err => {
        console.error("ERROR:", err);

        const lat = 12.9716;
        const lng = 77.5946;

        setPosition([lat, lng]);
        fetchNearby(lat, lng);
      }
    );
  }, []);

  const fetchNearby = async (lat, lng) => {
    try {
      const res = await API.get("/skills/nearby", {
        params: { lat, lng },
      });

      const data = res.data?.skills || [];

      if (!Array.isArray(data)) {
        setSkills([]);
        return;
      }

      const updatedSkills = data.map(skill => {
        const coords = getCoords(skill);

        if (!coords) {
          return { ...skill, distance: 9999 };
        }

        const distance = getDistance(lat, lng, coords[1], coords[0]);

        return { ...skill, distance };
      });

      updatedSkills.sort((a, b) => a.distance - b.distance);

      setSkills(updatedSkills);
    } catch (err) {
      console.error("API ERROR:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills
    .filter(skill => skill.skillName?.toLowerCase().includes(search.toLowerCase()))
    .filter(skill => (category ? skill.category === category : true))
    .filter(skill => {
      if (skill.distance === 9999) return true;
      return skill.distance <= maxDistance;
    });

  useEffect(() => {
    if (!mapRef.current || filteredSkills.length === 0) return;

    const timeout = setTimeout(() => {
      const bounds = [];

      filteredSkills.forEach(skill => {
        const coords = getCoords(skill);
        if (coords) {
          bounds.push([coords[1], coords[0]]);
        }
      });

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapRef.current.setView(position, 13);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [filteredSkills, position]);

  if (loading) return <p className="text-center mt-10">Loading map...</p>;
  if (!position) return <p>No location available</p>;

  return (
    
    <div className="flex h-[85vh] gap-4 p-4 bg-[var(--bg)] text-[var(--text)]">

     
      <div className="w-1/3 card p-4 overflow-y-auto rounded-2xl">

        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-xl font-bold text-blue-600">Nearby Skills</h2>

        
          <input
            type="text"
            placeholder="Search skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] bg-[var(--card)] text-[var(--text)] rounded-lg text-sm shadow-sm"
          />

        
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] bg-[var(--card)] text-[var(--text)] rounded-lg text-sm shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Cooking">Cooking</option>
            <option value="Art">Art</option>
            <option value="Fitness">Fitness</option>
            <option value="Academic">Academic</option>
          </select>

         
          <select
            value={maxDistance}
            onChange={e => setMaxDistance(Number(e.target.value))}
            className="px-3 py-1 border border-[var(--border)] bg-[var(--card)] text-[var(--text)] rounded-lg text-sm shadow-sm"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        {filteredSkills.map(skill => (
          <SkillCard
            key={skill._id}
            skill={skill}
            isActive={selectedSkill?._id === skill._id}
            onClick={() => {
              setSelectedSkill(skill);

              const coords = getCoords(skill);
              if (!coords) return;

              if (mapRef.current) {
                mapRef.current.setView([coords[1], coords[0]], 16);
              }
            }}
          />
        ))}
      </div>

 
      <div className="w-2/3 h-full rounded-2xl overflow-hidden shadow-lg border border-[var(--border)]">

        <MapContainer
          center={position}
          zoom={13}
          className="h-full w-full"
          whenCreated={map => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapController selectedSkill={selectedSkill} />

          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>

          <MarkerClusterGroup key={JSON.stringify(filteredSkills)}>
            {filteredSkills.map(skill => {
              const coords = getCoords(skill);

              if (
                !coords ||
                !Array.isArray(coords) ||
                coords.length !== 2 ||
                isNaN(coords[0]) ||
                isNaN(coords[1])
              ) {
                return null;
              }

              return (
                <Marker
                  key={skill._id}
                  position={[coords[1], coords[0]]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedSkill(skill),
                  }}
                >
                  <Popup>
                  
                    <div className="text-sm text-[var(--text)]">
                      <b>{skill.skillName}</b>
                      <br />
                      📏 {skill.distance.toFixed(2)} km
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default Nearby;

