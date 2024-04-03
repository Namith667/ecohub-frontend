import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Import the Firestore database
import { Link } from 'react-router-dom';
import eCommerceImage from '../../images/eCommerceImage.jpg';
import wasteCollectionImage from '../../images/wasteCollectionImage.jpeg';
import './UserHome.css';

function UserHome({ user }) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

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
      <h1>Welcome, {displayName || 'Guest'}!</h1>
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