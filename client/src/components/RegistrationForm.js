import React, { useMemo, useState } from 'react'
import '../css/componentCSS/FormSetup.css';
import '../css/componentCSS/RegistrationForm.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Asterisk, Eye, EyeOff } from 'lucide-react';

export default function RegistrationForm({newUserData, setNewUserData, onSubmit, onClearForm}) {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState(false)
    const [emailMsg, setEmailMsg] = useState(false)
    const [touched, setTouched] = useState({
        username: false,
        firstName: false,
        lastName: false,
        email: false,
        dateOfBirth: false,
        password: false,
    })

    // ========= CLIENT-SIDE VALIDATION STATE =========
    // Memoized "empty" checks (trimmed so "   " counts as empty)
    const usernameEmpty = useMemo(() => !String(newUserData.username || '').trim(), [newUserData.username])
    const firstNameEmpty = useMemo(() => !String(newUserData.fullName.firstName || '').trim(), [newUserData.fullName.firstName])
    const lastNameEmpty = useMemo(() => !String(newUserData.fullName.lastName || '').trim(), [newUserData.fullName.lastName])
    const emailEmpty = useMemo(() => !String(newUserData.email || '').trim(), [newUserData.email])
    const dateOfBirthEmpty = useMemo(() => !newUserData.dateOfBirth, [newUserData.dateOfBirth])
    const passwordEmpty = useMemo(() => !String(newUserData.password || '').trim(), [newUserData.password])

    // Only show validation errors AFTER field was touched
    const showUsernameError = touched.username && usernameEmpty
    const showFirstNameError = touched.firstName && firstNameEmpty
    const showLastNameError = touched.lastName && lastNameEmpty
    const showEmailError = touched.email && emailEmpty
    const showDateOfBirthError = touched.dateOfBirth && dateOfBirthEmpty
    const showPasswordError = touched.password && passwordEmpty

    // ========= IDs USED BY aria-labelledby / aria-describedby =========
    // Keeps ARIA references stable and readable
    const formTitleId = 'regisFormTitle'
    const emailHelpId = 'regisEmailHelp'
    const passwordHelpId = 'regisPasswordHelp'
    const usernameErrorId = 'regisUsernameError'
    const firstNameErrorId = 'regisFirstNameError'
    const lastNameErrorId = 'regisLastNameError'
    const emailErrorId = 'regisEmailError'
    const dateOfBirthErrorId = 'regisDateOfBirthError'
    const passwordErrorId = 'regisPasswordError'

    //==================EVENT LISTENERS=======================
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target
        const fieldValue = type === 'checkbox' ? checked : value

        // Handle nested fields like 'fullName.firstName'
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setNewUserData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: fieldValue,
                },
            }))
        } else {
            setNewUserData((prev) => ({
                ...prev,
                [name]: fieldValue,
            }))
        }
    }

    // Mark a field as touched on blur
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }

    //===============================================
    return (
        <form id='registrationForm' onSubmit={onSubmit} aria-describedby={formTitleId}>
            <div id='registrationDetails'>
                {/* Screen-reader form title */}
                <h2 id={formTitleId} className='visually-hidden'>Registration form</h2>
                <Row id='regisHeadingRow'>
                {/* Col 1 */}
                    <Col id='regisCol1'></Col>
                    {/* Col 2: HEADING */}
                    <Col xs={5} id='regisCol2'>
                        <div id='formHeadingBlock'>
                            <h3 className='formHeading'>SIGN UP</h3>
                        </div>
                    </Col>
                    {/* Col 3 */}
                    <Col id='regisCol3'></Col>
                </Row>
                {/* ======== ROW 1 — USERNAME + FULL NAME ======== */}
                <Row id='regisRow1'>
                {/* Col 4: username */}
                    <Col xs={6} md={4} id='regisCol4'>
                        <label className='regisLabel' htmlFor='regisUsername'>
                            <p className='labelText'>USERNAME:</p>
                            <input
                                className='input'
                                id='regisUsername'
                                type='text'
                                placeholder='USERNAME'
                                name='username'
                                value={newUserData.username}
                                required
                                inputMode='text'
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('username')}
                                // ARIA:
                                aria-label='Registration username input'
                                aria-required='true'
                                aria-invalid={usernameEmpty ? 'true' : 'false'}
                                aria-describedby={usernameEmpty ? usernameErrorId : undefined}
                            />
                            <Asterisk size={16} color='red' aria-hidden='true'/>
                        </label>
                        {/* Username error (screen reader only) */}
                        {showUsernameError && (
                            <p id={usernameErrorId} className='visually-hidden' role='alert'>
                                Username is required.
                            </p>
                        )}
                    </Col>
                    {/* Col 5: Full Name */}
                    <Col xs={12} md={8} id='regisCol5'>
                        <div id='regisName'>
                            {/* -------- FIRST NAME -------- */}
                            <label className='regisLabel' htmlFor='regisFirstName'>
                                <p className='labelText'>FIRST NAME:</p>
                                <input
                                    className='input'
                                    id='regisFirstName'
                                    type='text'
                                    required
                                    name='fullName.firstName'
                                    value={newUserData.fullName.firstName}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('firstName')}
                                    placeholder='FIRST NAME'
                                    inputMode='text'
                                    // ARIA:
                                    aria-label='First name input'
                                    aria-required='true'
                                    aria-invalid={firstNameEmpty ? 'true' : 'false'}
                                    aria-describedby={firstNameEmpty ? firstNameErrorId : undefined}
                                />
                                <Asterisk size={16} aria-hidden='true' color='reds'/>
                            </label>
                            {/* First name error (screen reader only) */}
                            {showFirstNameError && (
                                <p id={firstNameErrorId} className='visually-hidden' role='alert'>
                                    First name is required.
                                </p>
                            )}
                            {/* -------- LAST NAME -------- */}
                            <label className='regisLabel' htmlFor='regisLastName'>
                                <p className='labelText'>LAST NAME:</p>
                                <input
                                    className='input'
                                    id='regisLastName'
                                    type='text'
                                    placeholder='LAST NAME'
                                    required
                                    name='fullName.lastName'
                                    value={newUserData.fullName.lastName}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('lastName')}
                                    inputMode='text'
                                    // ARIA:
                                    aria-label='Last name input'
                                    aria-required='true'
                                    aria-invalid={lastNameEmpty ? 'true' : 'false'}
                                    aria-describedby={lastNameEmpty ? lastNameErrorId : undefined}
                                />
                                <Asterisk size={16} color='red' aria-hidden='true'/>
                            </label>
                            {/* Last name error (screen reader only) */}
                            {showLastNameError && (
                                <p id={lastNameErrorId} className='visually-hidden' role='alert'>
                                    Last name is required.
                                </p>
                            )}
                        </div>
                    </Col>
                </Row>
                {/* ======== ROW 2 — EMAIL + DATE OF BIRTH + ADMIN CHECKBOX======== */}
                <Row id='regisRow2'>
                {/* Col6 : Email*/}
                    <Col xs={6} md={4} id='regisCol6'>
                        <div id='regisEmail'>
                            <label className='regisLabel' htmlFor='regisEmailInput'>
                                <p className='labelText'>EMAIL:</p>
                                <input
                                    className='input'
                                    id='regisEmailInput'
                                    type='email'
                                    placeholder='EMAIL'
                                    required
                                    name='email'
                                    value={newUserData.email}
                                    inputMode='email'
                                    onChange={handleInputChange}
                                    onFocus={() => setEmailMsg(true)}
                                    onBlur={() => {
                                        setEmailMsg(false)
                                        handleBlur('email')
                                    }}
                                    // ARIA:
                                    aria-label='Email input'
                                    aria-required='true'
                                    aria-invalid={emailEmpty ? 'true' : 'false'}
                                    aria-describedby={[
                                        emailMsg ? emailHelpId : null,
                                        emailEmpty ? emailErrorId : null,
                                    ].filter(Boolean).join(' ') || undefined}
                                />
                                <Asterisk size={16} aria-hidden='true'/>
                            </label>
                            {/* Help text: announced politely while focused */}
                            {emailMsg && (
                                <div id='emailMsg'>
                                    <p
                                        className='msgText'
                                        id={emailHelpId}
                                        aria-live='polite'
                                    >
                                        <strong>WE WILL NEVER SHARE YOUR EMAIL</strong>
                                    </p>
                                </div>
                            )}
                            {/* Email error (screen reader only) */}
                            {showEmailError && (
                                <p id={emailErrorId} className='visually-hidden' role='alert'>
                                    Email is required.
                                </p>
                            )}
                        </div>
                    </Col>
                    {/* Col 7: Date of Birth */}

                    <Col xs={6} md={4} id='regisCol7' >
                        <label className='regisLabel' htmlFor='regisDateOfBirth'>
                            <p className='labelText'>DATE OF BIRTH:</p>
                            <input
                                className='input'
                                id='regisDateOfBirth'
                                type='date'
                                name='dateOfBirth'
                                value={newUserData.dateOfBirth}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('dateOfBirth')}
                                // ARIA:
                                aria-label='Date of birth input'
                                aria-required='true'
                                aria-invalid={dateOfBirthEmpty ? 'true' : 'false'}
                                aria-describedby={dateOfBirthEmpty ? dateOfBirthErrorId : undefined}
                            />
                            <Asterisk size={16} aria-hidden='true'/>
                        </label>
                        {/* Date of birth error (screen reader only) */}
                        {showDateOfBirthError && (
                            <p id={dateOfBirthErrorId} className='visually-hidden' role='alert'>
                                Date of birth is required.
                            </p>
                        )}
                    </Col>
                    {/* Col 8: Admin registration */}
                    <Col xs={6} md={4}  id='regisCol8'>
                        <div id='adminRegistration'>
                             <label className='regisLabel' htmlFor='regisAdmin'>
                            <p className='labelText'>REGISTER AS ADMIN:</p>
                            <input
                                id='regisAdmin'
                                type='checkbox'
                                name='admin'
                                checked={newUserData.admin}
                                onChange={handleInputChange}
                                // ARIA:
                                aria-label='Register as admin checkbox'
                                aria-describedby='regisAdminHelp'
                            />
                        </label>
                        <p id='regisAdminHelp' className='visibleMsg'>
                        <small>ADMIN USERS MUST BE 18 YEARS OR OLDER</small>
                        </p>
                        </div>
                    </Col>
                </Row>
                {/* ======== ROW 3 — PASSWORD ======== */}
                <Row id='regisRow3'>
                    <Col  md={8} id='regisCol'>
                        <div id='regisPassword'>
                            <label className='regisLabel' htmlFor='regisPasswordInput'>
                                <p className='labelText'>PASSWORD</p>
                                <input
                                    className='input'
                                    id='regisPasswordInput'
                                    placeholder='PASSWORD'
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    name='password'
                                    value={newUserData.password}
                                    onChange={handleInputChange}
                                    onFocus={() => setPasswordMsg(true)}
                                    onBlur={() => {
                                        setPasswordMsg(false)
                                        handleBlur('password')
                                    }}
                                    // ARIA:
                                    aria-label='Password input'
                                    aria-required='true'
                                    aria-invalid={passwordEmpty ? 'true' : 'false'}
                                    aria-describedby={[
                                        passwordMsg ? passwordHelpId : null,
                                        passwordEmpty ? passwordErrorId : null,
                                    ].filter(Boolean).join(' ') || undefined}
                                />
                                <Asterisk size={16} color='red' aria-hidden='true'/>
                            </label>
                            <Button
                                variant='warning'
                                id='showPasswordBtn'
                                type='button'
                                onClick={() => setShowPassword((s) => !s)}
                                // ARIA for toggle buttons:
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                aria-controls='regisPasswordInput'
                            >
                                {showPassword ? (
                                    <>
                                        HIDE PASSWORD
                                        <EyeOff
                                            style={{ marginLeft: 6 }}
                                            aria-hidden='true'
                                            focusable='false'
                                        />
                                    </>
                                ) : (
                                    <>
                                        SHOW PASSWORD
                                        <Eye
                                            style={{ marginLeft: 6 }}
                                            aria-hidden='true'
                                            focusable='false'
                                        />
                                    </>
                                )}
                            </Button>
                            {/* Help text: announced politely while focused */}
                            {passwordMsg && (
                                <div>
                                    <p
                                        className='msgText'
                                        id={passwordHelpId}
                                        aria-live='polite'
                                    >
                                        <strong>WE WILL NEVER SHARE YOUR PASSWORD</strong>
                                    </p>
                                </div>
                            )}
                            {/* Password error (screen reader only) */}
                            {showPasswordError && (
                                <p id={passwordErrorId} className='visually-hidden' role='alert'>
                                    Password is required.
                                </p>
                            )}
                        </div>
                    </Col>
                    <Col xs={6} md={4}>
                    <Stack gap={2}  id='regisBtnStack'>
                            <Button
                                variant='light'
                                id='registerBtn'
                                type='submit'
                                aria-label='Submit registration form'
                            >
                                REGISTER
                            </Button>
                            <Button
                                variant='danger'
                                id='clearFormBtn'
                                type='button'
                                onClick={onClearForm}
                                aria-label='Clear registration form'
                            >
                                CLEAR FORM
                            </Button>
                        </Stack>
        </Col>
                </Row>
                {/* ======== ROW 4 — BUTTONS ======== */}
                <Row id='regisRow4'>
                    <Col id='regisCol'></Col>
                    <Col xs={5} id='regisBtnCol'>
                        <Stack gap={2} className='col-md-5 mx-auto' id='regisBtnStack'>
                            <Button
                                variant='light'
                                id='registerBtn'
                                type='submit'
                                aria-label='Submit registration form'
                            >
                                REGISTER
                            </Button>
                            <Button
                                variant='danger'
                                id='clearFormBtn'
                                type='button'
                                onClick={onClearForm}
                                aria-label='Clear registration form'
                            >
                                CLEAR FORM
                            </Button>
                        </Stack>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
        </form>
    )
}