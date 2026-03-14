import React from 'react'
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Users.css'
import '../css/componentCSS/UserData.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
// CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
//Utility Functions
import { dateDisplay } from '../utilFunctions/dateFunctions';

// ========MAIN USERS COMPONENT===========
export default function Users(//Export default Users function component 
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout, 
    currentUser, 
    users, 
    setUsers
  }) {

      //============REQUESTS===============
  //Function to delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('[ERROR: Users.js] Failed to delete user:', data.message);
        return;
      }

      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error('[ERROR: Users.js] Error deleting user:', error.message);
    }
  };

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
      <Row id='userListRow'>
        <Col xs={3} md={2} id='userListCol1'></Col>
        <Col xs={12} md={8} id='userListCol'>
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
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className='userUsername'>{user.username}</td>
                    <td className='userFullName'>{user.fullName?.firstName} {user.fullName?.lastName}</td>
                    <td className='userEmail'>{user.email}</td>
                    <td>{dateDisplay(user.dateOfBirth)}</td>
                    <td>
                      {user.admin && (
                        <Badge id='adminBadge'>ADMIN</Badge>
                      )}
                    </td>
                    <td>
                      {(() => {
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
        <Col xs={3} md={2} id='userListCol2'></Col>
      </Row>
     </section>
     {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
