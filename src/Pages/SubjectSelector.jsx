import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TuitionFinder = () => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState([
  ]);

  const handleSubjectSelect = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSubject = () => {
    if (searchTerm && !subjects.includes(searchTerm)) {
      setSubjects([...subjects, searchTerm]);
      setSelectedSubjects([...selectedSubjects, searchTerm]); // Add the new subject to selectedSubjects
      setSearchTerm("");
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSubjectExists = subjects.some((subject) =>
    subject.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue-700 overflow-hidden">
      {/* Left Section */}
      <div
        className="bg-[#2E3192] shadow-lg rounded-lg flex items-center justify-center"
        style={{
          height: "1010px",
          width: "100%",
          maxWidth: "1902px",
        }}
      >
        <div className="w-full max-w-3xl px-6 py-8">
          {/* Logo Only */}
          <div className="flex justify-center mb-6">
            <img src="src/assets/LOGO.png" alt="Tuition Finder" className="h-62px" />
          </div>
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-white font-inter text-[32px]">
              Find Online & home tutor in seconds
            </p>
            <p className="text-gray-300">
              You can choose multiple subjects from the search bar
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search Subject"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {/* Show buttons only for matched subjects */}
              {filteredSubjects.map((subject) => (
                <button
                  key={subject}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedSubjects.includes(subject)
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-[#A1A4FF] text-white hover:bg-blue-300"
                  }`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  {subject}
                  {selectedSubjects.includes(subject) && (
                    <span
                      className="ml-2 text-sm font-medium cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the parent button click event
                        handleSubjectSelect(subject);
                      }}
                    >
                      x
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!isSubjectExists && searchTerm && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleAddSubject}
                  className="px-4 py-2 font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Add Subject
                </button>
              </div>
            )}
          </div>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Radio Button Groups - Aligned Horizontally */}
            {[
              {
                title: "Are you looking for one teacher to teach all selected subjects?",
                name: "teacher-selection",
                options: ["Recommend multiple teachers", "One teacher will teach all"],
              },
              {
                title: "What do you want?",
                name: "class-preference",
                options: ["Individual attention", "I prefer group classes"],
              },
              {
                title: "What mode of teaching do you prefer?",
                name: "teaching-mode",
                options: ["Offline", "Online", "I am comfortable with both"],
              },
              {
                title: "Medium of learning",
                name: "medium",
                options: ["English", "Hindi", "Bengali", "Language is not an issue"],
              },
            ].map((group, index) => (
              <div key={index} className="text-center">
                <p className="font-medium mb-3 text-white">{group.title}</p>
                <div className="flex justify-center space-x-6">
                  {group.options.map((option, i) => (
                    <label key={i} className="flex items-center text-white">
                      <input
                        type="radio"
                        name={group.name}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {/* Explore Button */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => navigate('/teacherfinder')}
                className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Explore Teachers
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section - Banner Image */}
      <div className="hidden lg:block lg:h-[1010px] lg:w-[902px] overflow-hidden">
        <img
          src="src/assets/banner.png"
          alt="Banner"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default TuitionFinder;