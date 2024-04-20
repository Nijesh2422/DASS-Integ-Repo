import React, { PureComponent, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

export default function Versioning() {
  const [first, setFirstPage] = useState("");
  const [second, setSecondPage] = useState("");
  const [DiffArray, setDiffArray] = useState([]);

  async function fetchDiffData() {
    try {
      const response = await fetch(`/difference`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch page data");
      }
      const responseData = await response.json();
      console.log(responseData);
      setDiffArray(responseData.differencearray);
      setFirstPage(responseData.currentText);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  const fetchedDiff = [
    {
      count: 86,
      value:
        "\n" +
        "\n" +
        "IIT-H IT POLICIES \n" +
        "International Institute of Information Technology, Hyderabad \n" +
        "202",
    },
    { count: 1, added: undefined, removed: true, value: "2" },
    { count: 1, added: true, removed: undefined, value: "1" },
    {
      count: 567,
      value:
        "-v1.0 \n" +
        "IIIT-H will not take responsibility for any pirated content sharing in the institute. \n" +
        " \n" +
        "1) All institute machines should not have pirated software and content. If it has a proprietary \n" +
        "software, it should be licenced. Institute recommends use of free and open source software. \n" +
        " \n" +
        "2) If the user installs pirated software and content on any server or machine, the owner/user of the \n" +
        "machine will be held responsible. The institute will not protect the individuals from any \n" +
        "legal/administrative action taken by the owner of the IPR and law enforcement agencies",
    },
    { count: 1, added: undefined, removed: true, value: "." },
    { count: 1, value: " " },
  ];

  function createTwoPages() {
    console.log(DiffArray);
    let secondPage = "";
    let i = 0;
    let index;
    for (index = 0; i < DiffArray.length; i++) {
      if (index != DiffArray[i].startindex) {
        secondPage += first.slice(index, DiffArray[i].startindex);
        index = DiffArray[i].startindex;
      }
      if (DiffArray[i].removed) {
        secondPage += DiffArray[i].value;
      }
      if (DiffArray[i].added) {
        index = DiffArray[i].startindex + DiffArray[i].value.length;
      }
    }
    console.log(index);
    if(index < first.length)
    {
      secondPage += first.slice(index,first.length);
    }
    setSecondPage(secondPage);
  }

  useEffect(() => {
    fetchDiffData();
  }, []);

  useEffect(() => {
    if (DiffArray.length > 0) {
      createTwoPages();
    }
  }, [DiffArray]);

  return (
    <ReactDiffViewer oldValue={first} newValue={second} splitView={true} />
  );
}
