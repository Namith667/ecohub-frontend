import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Import the Firestore database
import { Link ,useNavigate, navigate} from 'react-router-dom';
import eCommerceImage from '../../images/eCommerceImage.jpg';
import wasteCollectionImage from '../../images/wasteCollectionImage.jpeg';
import './UserHome.css';

function UserHome({ user }) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchDisplayName = async () => {
        console.log('user:', user);
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        console.log('userDoc:', userDoc.data());
        if (userDoc.exists()) {
          setDisplayName(userDoc.data().displayName);
        }
        setLoading(false);
      };

      fetchDisplayName();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      
     <div className='image-banner'>
      <h5>Welcome, {displayName || 'Guest'}!
      <p style={{fontSize:"25px", fontWeight:"lighter"}}>Be the change you want to see in the world: Reduce, Reuse, Recycle.</p>
      </h5>
   
        <img src="https://images.unsplash.com/photo-1625120261086-739ea96ccb93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
          </img>
     </div>
      
      <div className="image-container">
        <div className="image-box">
          <h2>Waste Collection</h2>
          <Link to="/wasteCollection">
            <img src={wasteCollectionImage} alt="Go to Waste Collection" className="image" />
          </Link>
        </div>
        <div className="image-box">
          <h2>Ecommerce</h2>
          <Link to="/eCommerce">
            <img src={eCommerceImage} alt="Go to Ecommerce" className="image" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserHome;