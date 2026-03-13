import React, { useState } from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import '../css/componentCSS/QuizData.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { ArrowBigLeftDash, ArrowBigRightDash, FileQuestionMark } from 'lucide-react';

export default function EditQuizForm({
    editQuiz,
    error,
    currentUser,
    quizName,
    setQuizName,
    description,
    setDescription,
    questions,
    setQuestions,
    editQuizId,
}) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [loadingEdit, setLoadingEdit] = useState(false)

    const handleEdit = async (e) => {
        e.preventDefault()
        const confirmEdit = window.confirm('Are you sure you want to edit this quiz?')
        if (!confirmEdit) return;
        setLoadingEdit(true)
        try {
            await editQuiz()
        } finally {
            setLoadingEdit(false)
        }
    }

    const currentQuestion = questions[currentQuestionIndex]

    const updateCurrentQuestion = (field, value) => {
        setQuestions(questions.map((q, i) =>
            i === currentQuestionIndex ? { ...q, [field]: value } : q
        ))
    }

    const updateOption = (optIndex, value) => {
        setQuestions(questions.map((q, i) => {
            if (i !== currentQuestionIndex) return q
            const options = [...q.options]
            options[optIndex] = value
            return { ...q, options }
        }))
    }

    if (!editQuizId) return null

    return (
        <form id='editQuizForm' onSubmit={handleEdit} aria-labelledby='editQuizData'
            aria-busy={loadingEdit}
            method='PATCH'
        >
            {/* -----Screen Reader Heading-------- */}
            <p className='visually-hidden' id='editQuizData'>EDIT QUIZ FORM</p>
            {/* -----STACK 1: Form Heading + success/error messages CreatedBy */}
            <Stack gap={3} id='editQuizStack1'>
                <div className="p-2" id='editQuizFormHeading'>
                    <h3 className='formHeading'>EDIT QUIZ</h3>
                </div>
                <div id='editQuizStatus' aria-live='polite' aria-atomic='true'>
                    {error && <div className='error-message' role='alert'>{error}</div>}
                </div>
                <div id='editCreatedByBlock' aria-label='Quiz creator'>
                    <h6 className='formText'>CREATED BY: {currentUser?.fullName?.firstName} {currentUser?.fullName?.lastName}</h6>
                </div>
            </Stack>
            <div id='editQuizDetails'>
                <Stack gap={3} id='editQuizStack2'>
                    {/*--------- QUIZ NAME---------------- */}
                    <div className="p-2" id='editQuizNameBlock'>
                        <label className='editQuizLabel' htmlFor='editQuizNameInput'>
                            <p className='labelText'>QUIZ NAME:</p>
                        </label>
                        <input
                            className='input'
                            type='text'
                            id='editQuizNameInput'
                            name='quizName'
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            autoComplete='off'
                            aria-label='Edit quiz name'
                            aria-required='true'
                            disabled={loadingEdit}
                        />
                    </div>
                    {/* --------QUIZ DESCRIPTION ------------*/}
                    <div className="p-2" id='editQuizDescriptionBlock'>
                        <label htmlFor='editQuizDescriptionInput'>
                            <p className='labelText'>QUIZ DESCRIPTION:</p>
                        </label>
                        <input
                            className='input'
                            type='text'
                            id='editQuizDescriptionInput'
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoComplete='off'
                            aria-label='Edit quiz description'
                            aria-required='true'
                            disabled={loadingEdit}
                        />
                    </div>
                    {/*-------- QUESTIONS ----------------- */}
                    <div id='editQuestions'>
                    {/* -------Screen Reader Heading */}
                     <h4 className='formSectionHeading'><FileQuestionMark aria-hidden='true'/>QUESTIONS</h4>
                    {questions.length > 0 && currentQuestion && (
                        <div
                            id='editQuestionsBlock'
                            role='group'
                            aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                        >
                            <p className='labelText' aria-hidden='true'>
                                QUESTION {currentQuestionIndex + 1} OF {questions.length}:
                            </p>
                            {/* --------NAVIGATION BUTTONS--------- */}
                            <div id='editQuizNavBtns' role='navigation' aria-label='Question navigation'>
                            {/* Previous Question button */}
                                <Button
                                    size='sm'
                                    type='button'
                                    onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    aria-label='Previous question'
                                >
                                    <ArrowBigLeftDash fontWeight={700} color='#000' aria-hidden='true' />
                                </Button>
                                {/* Next Question button */}
                                <Button
                                    size='sm'
                                    type='button'
                                    onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    aria-label='Next question'
                                >
                                    <ArrowBigRightDash fontWeight={700} color='#000' aria-hidden='true' />
                                </Button>
                            </div>
                            <Stack gap={2}>
                                <div>
                                    <label htmlFor='editQuestionText'>
                                        <p className='labelText'>QUESTION:</p>
                                    </label>
                                    <input
                                        className='input'
                                        type='text'
                                        id='editQuestionText'
                                        value={currentQuestion.questionText}
                                        onChange={(e) => updateCurrentQuestion('questionText', e.target.value)}
                                        autoComplete='off'
                                        aria-label='Edit question text'
                                        aria-required='true'
                                        disabled={loadingEdit}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='editCorrectAnswer'>
                                        <p className='labelText'>CORRECT ANSWER:</p>
                                    </label>
                                    <input
                                        className='input'
                                        type='text'
                                        id='editCorrectAnswer'
                                        value={currentQuestion.correctAnswer}
                                        onChange={(e) => updateCurrentQuestion('correctAnswer', e.target.value)}
                                        autoComplete='off'
                                        aria-label='Edit correct answer'
                                        aria-required='true'
                                        disabled={loadingEdit}
                                    />
                                </div>
                                {currentQuestion.options.map((opt, i) => (
                                    <div key={i}>
                                        <label htmlFor={`editOption${i}`}>
                                            <p className='labelText'>{i + 1}. ALTERNATIVE ANSWER:</p>
                                        </label>
                                        <input
                                            className='input'
                                            type='text'
                                            id={`editOption${i}`}
                                            value={opt}
                                            onChange={(e) => updateOption(i, e.target.value)}
                                            autoComplete='off'
                                            aria-label={`Alternative answer ${i + 1}`}
                                            aria-required='true'
                                            disabled={loadingEdit}
                                        />
                                    </div>
                                ))}
                            </Stack>
                        </div>
                    )}
                    </div>
                </Stack>
            </div>
            {/* ---------STACK 3: BUTTONS: editQuizBtn + clearFormBtn ----------------- */}
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack3' role='toolbar' aria-label='Form actions'>
            {/* Edit quiz submit */}
                <Button
                    variant="light"
                    type='submit'
                    id='editQuizBtn'
                    disabled={loadingEdit}
                    aria-busy={loadingEdit}
                    aria-label={loadingEdit ? 'Saving quiz changes' : 'Submit edit quiz form'}
                >{loadingEdit ? 'SAVING...' : 'EDIT QUIZ'}</Button>
                {/* Clear Form Btn */}
                <Button
                    variant="danger"
                    type='button'
                    id='clearFormBtn'
                    onClick={() => { setQuizName(''); setDescription(''); }}
                    aria-label='Clear quiz name and description fields'
                    disabled={loadingEdit}
                >
                    CLEAR
                </Button>
            </Stack>
        </form>
    )
}
