import { useState, useEffect } from "react";
import axiosInstance from "../config/axios-instance";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const GradeSectionDropdown = ({
  selectedGrade,
  setSelectedGrade,
  selectedSection,
  setSelectedSection,
}) => {
  const [classProfiles, setClassProfiles] = useState([]);
  const gradeOptions = Array.from(new Set(classProfiles.map((cp) => cp.grade)));
  const sectionOptions = classProfiles
    .filter((cp) => cp.grade === selectedGrade)
    .map((cp) => cp.section);

  const fetchClassProfiles = async () => {
    try {
      const response = await axiosInstance.get(
        "classProfile/fetchClassProfile"
      );
      const updatedClassProfiles = response.data.map((classProfile) => {
        return {
          ...classProfile,
        };
      });
      setClassProfiles(updatedClassProfiles);
    } catch (error) {
      console.error("Error:", error.message, "Data:", error.data);
    }
  };

  // Fetch ClassProfiles when the component mounts
  useEffect(() => {
    fetchClassProfiles();
  }, []);

  return (
    <>
      <Select
        label="Grade Level"
        required
        fullWidth
        margin="normal"
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
        displayEmpty // This enables the placeholder to show even when the list is empty
      >
        <MenuItem value="" disabled>
          Select Grade
        </MenuItem>
        {gradeOptions.map((grade, index) => (
          <MenuItem key={index} value={grade}>
            {grade}
          </MenuItem>
        ))}
      </Select>

      <Select
        label="Section"
        required
        fullWidth
        margin="normal"
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        displayEmpty // This enables the placeholder to show even when the list is empty
      >
        <MenuItem value="" disabled>
          Select Section
        </MenuItem>
        {sectionOptions.map((section, index) => (
          <MenuItem key={index} value={section}>
            {section}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default GradeSectionDropdown;
