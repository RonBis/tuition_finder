import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import TF from "./Pages/TuitionFinder";
import PDF_T from "./Pages/PersonalDetailsForm1_Teacher";
import Slots from "./Pages/Slots";
import PD from "./Pages/ProfileDashbooard";
import TeacherFinder from "./Pages/TeacherFinder";
import Role from "./Pages/Role";
import EDF_T from "./Pages/EducationalQualification_Teacher";
import Subject from './Pages/SubjectSelector';
import PDF_S from './Pages/PersonalDetails_Student';
import EDF_S from './Pages/EducationalQualification_Student';
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<TF />} />
        <Route path='/details' element={<PDF_T />} />
        <Route path='/studentdetails1' element={<PDF_S />} />
        <Route path='/studentdetails2' element={<EDF_S />} />
        <Route path='/details2' element={<EDF_T />} />
        <Route path='/slots' element={<Slots />} />
        <Route path='/profile' element={<PD />} />
        {/* Redirect to check.html */}
        <Route path='/tutor' element={<Navigate to="/check.html" />} />
        <Route path='/teacherfinder' element={<TeacherFinder />} />
        <Route path='/role' element={<Role/>} />
        <Route path='/subject' element={<Subject/>} />
      </Routes>
    </div>
  );
};

export default App;
