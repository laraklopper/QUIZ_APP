// Users.js
//IMPORT REQUIRED MODULES AND PACKAGES
import { useCallback } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Users.css'
import '../css/componentCSS/UserData.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
// IMPORT CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
// IMPORT ICONS FROM LUCIDE-REACT
import { BookUser } from 'lucide-react';
//iMPORT UTILITY FUNCTIONS
import { dateDisplay } from '../utilFunctions/dateFunctions';

// ========MAIN USERS COMPONENT===========
export default function Users(//Export default Users function component
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout,      // Function to log the user out
    currentUser, // Object containing the currently logged-in user's details
    users,       // Array of all registered users
    setUsers     // Function to update the users list state
  }) {

      //============REQUESTS===============
  //----------DELETE----------------
  // Function to delete a user by their ID
  const handleDeleteUser = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem('token');// Retrieve JWT token from localStorage
      // Send a DELETE request to remove the user with the given ID
      const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
        method: 'DELETE', // HTTP request method
        mode: 'cors',     // Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json', // Specify the Content-Type in the request payload
          'Authorization': `Bearer ${token}`  // Attach JWT token for authorization
        }
      });

      /* Conditional rendering to check if the response
      is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        const data = await response.json();// Parse the error response body
        console.error('[ERROR: Users.js] Failed to delete user:', data.message);//Log an error message in the console for debugging purposes
        return;
      }

      // Remove the deleted user from the local state to update the UI
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error('[ERROR: Users.js] Error deleting user:', error.message);//Log an error message in the console for debugging purposes
    }
  }, [setUsers]);

  // ================JSX RENDERING======================

  return (
    <Container id='pageContainer' role='main'>
     {/* HEADER */}
     {/* Render the HeaderComponent with USERS as the Heading */}
     <Header heading='USERS' currentUser={currentUser}/>
     {/* SECTION 1: User List */}
     <section id='userList'>
         <Row id='userListHeadingRow'>
        <Col id='userListHeadCol1'></Col>
        <Col xs={5} id='userListHeadCol'>
          <h2 id='userListHeading'>USERS:</h2>
        </Col>
        <Col id='userListHeadCol2'></Col>
      </Row>
      {/* =========EVENT/ANIMATION=========== */}
      <Row id='usersEventRow' role='presentation'>
        <Col id='usersEventCol'>
          <div className='event-bar'>
            <div className='event-track'>
               <BookUser className='event-slide' size={32} aria-hidden='true' focusable="false" />
            </div>
          </div>
        </Col>
      </Row>
      {/* ----------DISPLAY LIST OF USERS--------- */}
      <Row id='userListRow'>
        <Col id='userListCol'>
        {/* TABLE DISPLAYING THE USERS LIST */}
          {users && users.length > 0 ? (
            <table id='userListTable'>
              <thead>
                <tr>
                  <th>USERNAME</th>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>DATE OF BIRTH</th>
                  <th>ROLE</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {/* Map over the users array to render a table row for each user */}
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className='userUsername'>{user.username}</td>
                    <td className='userFullName'>{user.fullName?.firstName} {user.fullName?.lastName}</td>
                    <td className='userEmail'>{user.email}</td>
                    <td>{dateDisplay(user.dateOfBirth)}</td>{/* Format and display the date of birth */}
                    <td>
                      {/* Display an ADMIN badge only if the user has admin privileges */}
                      {user.admin && (
                        <Badge id='adminBadge'>ADMIN</Badge>
                      )}
                    </td>
                    <td>
                      {(() => {
                        // Disable delete for admins and for the currently logged-in user
                        const isDisabled = user.admin || user._id === currentUser?._id;
                        return (
                          <Button
                            id='deleteUserBtn'
                            size='sm'
                            disabled={isDisabled}
                            onClick={() => !isDisabled && handleDeleteUser(user._id)}
                          >
                            DELETE
                          </Button>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p id='noUsersMsg'>NO USERS FOUND</p>
          )}
        </Col>
      </Row>
     </section>
     {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
