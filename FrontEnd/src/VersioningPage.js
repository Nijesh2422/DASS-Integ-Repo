import React, { PureComponent, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import Button from "@mui/material/Button";
import "./VersioningPage.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
export default function Versioning() {
  const { fieldId } = useParams();
  console.log(fieldId);
  const [versions, setVersions] = useState(0);
  const [initData, setInitData] = useState({});
  const [Old, setOldPage] = useState("");
  const [New, setNewPage] = useState("");
  const [NoOfOptions, setNoofOptions] = useState(0);
  const [currentVersion, setCurrentVersion] = useState(0);
  // const [diffArrays, setDiffArrays]= useState([]);
  const fetchInitData = async (fieldId) => {
    try {
      const response = await fetch(`/version-initial-load/${fieldId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch page data");
      }
      const initVerData = await response.json();
      const parsedInitData =
        typeof initVerData === "object" ? initVerData : JSON.parse(initVerData);
      setInitData(parsedInitData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDiffArrays = async (version, depth, id) => {
    try {
      const response = await fetch(`/get-diff/${version}/${depth}/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Difference Array data");
      }
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  function Destruct(NewText, diffArrays) {
    let OldText = NewText;
    for (let i = 0; i < diffArrays.length; i++) {
      NewText = OldText;
      OldText = "";
      let k = 0;
      let index;
      const DiffArray = diffArrays[i];
      for (index = 0; k < DiffArray.length; k++) {
        if (index !== DiffArray[k].startindex) {
          OldText += NewText.slice(index, DiffArray[k].startindex);
          index = DiffArray[k].startindex;
        }
        if (DiffArray[k].removed) {
          OldText += DiffArray[k].value;
        }
        if (DiffArray[k].added) {
          index = DiffArray[k].startindex + DiffArray[k].value.length;
        }
      }
      if (index < NewText.length) {
        OldText += NewText.slice(index, NewText.length);
      }
    }
    setNewPage(NewText);
    setOldPage(OldText);
  }
  function Destruct(NewText, diffArrays) {
    let OldText = NewText;
    for (let i = 0; i < diffArrays.length; i++) {
      NewText = OldText;
      OldText = "";
      let k = 0;
      let index;
      const DiffArray = diffArrays[i];
      for (index = 0; k < DiffArray.length; k++) {
        if (index !== DiffArray[k].startindex) {
          OldText += NewText.slice(index, DiffArray[k].startindex);
          index = DiffArray[k].startindex;
        }
        if (DiffArray[k].removed) {
          OldText += DiffArray[k].value;
        }
        if (DiffArray[k].added) {
          index = DiffArray[k].startindex + DiffArray[k].value.length;
        }
      }
      if (index < NewText.length) {
        OldText += NewText.slice(index, NewText.length);
      }
    }
    setNewPage(NewText);
    setOldPage(OldText);
  }

  function Construct(OldText, diffArrays) {
    let NewText = OldText;
    for (let i = 0; i < diffArrays.length; i++) {
      OldText = NewText;
      NewText = "";
      let k = 0;
      let index;
      console.log(i, NewText, diffArrays[i]);
      const DiffArray = diffArrays[i];
      NewText += OldText.slice(0, DiffArray[0].constructindex);
      for (index = DiffArray[0].constructindex; k < DiffArray.length; k++) {
        // if (index !== DiffArray[k].constructindex) {
        //   NewText += OldText.slice(index, DiffArray[k].constructindex);
        //   index = DiffArray[k].constructindex;
        //   console.log("same")
        // }
        // if (DiffArray[k].added) {
        //   NewText += DiffArray[k].value;
        //   console.log("add")
        // }
        // if (DiffArray[k].removed) {
        //   index = DiffArray[k].constructindex + DiffArray[k].value.length;
        //   console.log("remove")
        // }
        console.log(NewText);
        console.log("Before :" + index, k);
        NewText += OldText.slice(index, DiffArray[k].constructindex);
        const oldValue = index;
        index = DiffArray[k].constructindex;
        if (DiffArray[k].removed) {
          var flag = 0;
          if (k < DiffArray.length - 1) {
            if (
              DiffArray[k + 1].added &&
              index === DiffArray[k + 1].constructindex
            ) {
              NewText += DiffArray[k + 1].value;
              flag += 1;
              k += 1;
            }
          }
          if (flag == 0) {
            index = DiffArray[k].constructindex + DiffArray[k].value.length;
          } else {
            index =
              DiffArray[k - 1].constructindex + DiffArray[k - 1].value.length;
          }
        } else if (DiffArray.added) {
          NewText += DiffArray[k].value;
        }
        console.log("After :" + index, k);
      }
      if (index < OldText.length) {
        NewText += OldText.slice(index, OldText.length);
      }
    }
    setNewPage(NewText);
    setOldPage(OldText);
  }
  
  function createTwoPages(CurrentText, DiffArray) {
    console.log(DiffArray);
    console.log("HI");
    let oldPage = "";
    let i = 0;
    let index;
    for (index = 0; i < DiffArray.length; i++) {
      if (index !== DiffArray[i].startindex) {
        oldPage += CurrentText.slice(index, DiffArray[i].startindex);
        index = DiffArray[i].startindex;
      }
      if (DiffArray[i].removed) {
        oldPage += DiffArray[i].value;
      }
      if (DiffArray[i].added) {
        index = DiffArray[i].startindex + DiffArray[i].value.length;
      }
    }
    console.log(index);
    if (index < CurrentText.length) {
      oldPage += CurrentText.slice(index, CurrentText.length);
    }
    setOldPage(oldPage);
  }
  useEffect(() => {
    fetchInitData(fieldId);
  }, []);

  useEffect(() => {
    if (Object.keys(initData).length !== 0) {
      setNewPage(initData.currentText);
      setCurrentVersion(initData.noOfVersion);
      setNoofOptions(initData.noOfVersion);
      console.log("initData is set:", initData);
      createTwoPages(initData.currentText, initData.finalDiffArray);
    }
  }, [initData]);

  const handleVersionChange = async (event) => {
    const destinationVersion = event.target.value;
    console.log(destinationVersion);
    try {
      const response = await fetch(
        `/get-diff/${currentVersion}/${destinationVersion}/${fieldId}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      const diffArrays = responseData.diffArrays;
      // setDiffArrays(responseData.diffArrays);
      if (destinationVersion > currentVersion) {
        Construct(New, diffArrays);
        // createTwoPages(second,diffArrays)
      } else {
        Destruct(Old, diffArrays);
      }
      setCurrentVersion(destinationVersion);
    } catch (error) {
      console.log(error);
    }
  };

  function SelectOptions({ lastIndex }) {
    const ranges = [];
    for (let i = lastIndex + 1; i > 1; i--) {
      ranges.push({ value: i - 1, label: `${i - 1} - ${i}` });
    }

    const renderOptions = () => {
      return ranges.map((range, index) => (
        <option key={index} value={range.value}>
          {range.label}
        </option>
      ));
    };

    return (
      <FormControl sx={{ width: "6vw" }}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Version
        </InputLabel>
        <NativeSelect
          value={currentVersion}
          onChange={(e) => handleVersionChange(e)}
          // inputProps={{
          //   name: "Version",
          //   id: "uncontrolled-native",
          // }}
        >
          {renderOptions()}
        </NativeSelect>
      </FormControl>
    );
  }

  return (
    <div className="VersioningMain">
      <div className="VersioningHeader">
        <Button
          variant="contained"
          sx={{ width: "7vw", mt: "1%", mb: "1%" }}
          // onClick={handleSubmit}
        >
          Prev
        </Button>
        {/* <FormControl sx={{ width: "6vw" }}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Version
          </InputLabel>
          <NativeSelect
            defaultValue={30}
            inputProps={{
              name: "Version",
              id: "uncontrolled-native",
            }}
          >
            <option value={4}>3 - 4</option>
            <option value={3}>2 - 3</option>
            <option value={2}>1 - 2</option>
          </NativeSelect>
        </FormControl> */}
        <SelectOptions lastIndex={NoOfOptions} />
        <Button
          variant="contained"
          sx={{ width: "7vw", mt: "1%", mb: "1%" }}
          // onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
      <div className="VersionNames">
        <p>Version 3</p>
        <p>Version 4</p>
      </div>
      <div className="DiffViewer">
        <ReactDiffViewer oldValue={Old} newValue={New} splitView={true} />
      </div>
    </div>
  );
}
