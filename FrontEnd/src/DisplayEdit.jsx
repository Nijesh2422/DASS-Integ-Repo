import React, { useState } from "react";
import { useEffect } from "react";
import "./AddNew.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.core.css";

Quill.register('modules/imageResize', ImageResize);

const Items = ["Image", "Text", "Blocks"];

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [{ align : [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize'],
  }
}

export default function DisplayEditPage({ Edititems,responseData }) {
  const navigate = useNavigate();
  const [Show, setShow] = useState(false);
  const [New, setNew] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1000);
  const [selectedItems, setSelectedItems] = useState([]);
  const [blockId, setBlockId] = useState(0);

  useEffect(()=>{
    let maxBlockID = 0;
    Edititems.forEach((obj) => {
      if(obj.type === "Blocks"){
        if(obj.block_id > maxBlockID){
          maxBlockID = obj.block_id;
        }
      }
    });
    console.log(maxBlockID);
    console.log(selectedItems);
    setBlockId(maxBlockID);
    setSelectedItems(Edititems);
  },[Edititems]);
  
  const handleItemClick = (index) => {
    setNew(false);
    setSelectedIndex(index);
  };

  const handleHeightChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, height: value };
    setSelectedItems(newItems);
  };

  const handleWidthChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, width: value };
    setSelectedItems(newItems);
  };

  const handleBlockImageWidth = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, image_width: value };
    setSelectedItems(newItems);
  };

  const handleBlockImageHeight = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, image_height: value };
    setSelectedItems(newItems);
  };

  const handleBlockImageRadius = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, image_radius: value };
    setSelectedItems(newItems);
  };

  const handleBorderRadiusChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, borderRadius: value };
    setSelectedItems(newItems);
  };

  const handleAlignmentChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, alignment: value };
    setSelectedItems(newItems);
  };

  const handleBlockImageAlignment = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, image_align: value };
    setSelectedItems(newItems);
  };

  const handleaddImage = (e, index, item) => {
    const newItems = [...selectedItems];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newItems[index] = {
            ...item,
            Imagedata: reader.result,
            image_align: "center",
            image_width: "10",
            image_height: "10",
            image_radius: "0",
          };
          setSelectedItems([...newItems]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlereplaceImage = (e, index, item) => {
    const newItems = [...selectedItems];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newItems[index] = {
            ...item,
            data: reader.result,
          };
          setSelectedItems([...newItems]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleItemChange = (e, Item) => {
    if (Item === "Image") {
      const files = e.target.files;
      const newItems = [...selectedItems];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newItems.push({
              type: "Image",
              data: reader.result,
              isdone: false,
              width: "50",
              height: "50",
              borderRadius: "0",
              alignment: "center",
            });
            setSelectedItems([...newItems]);
          };
          reader.readAsDataURL(file);
        }
      }
    } else if (Item === "Text") {
      const newItems = [...selectedItems];
      newItems.push({ type: "Text", data: "", isdone: false });
      setSelectedItems([...newItems]);
    } else if (Item === "Blocks") {
      const newItems = [...selectedItems];
      const newBlockId = blockId + 1;
      newItems.push({
        type: "Blocks",
        data: "",
        isdone: false,
        isFirst: true, // Set isFirst property
        block_id: newBlockId,
        bgcolor: "white",
        color: "black",
        Imagedata: "",
      });
      newItems.push({
        type: "Blocks",
        data: "",
        isdone: false,
        isFirst: false, // Set isFirst property
        block_id: newBlockId,
        bgcolor: "white",
        color: "black",
        Imagedata: "",
      });
      setSelectedItems([...newItems]);
      setBlockId(newBlockId);
    }
  };

  async function publishFunction({newItems,index}){
    const data = {
      newItems: newItems,
      index: index
    };
    try{
      const response = await fetch(`/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      console.log("Published Successfully");
      navigate('/admin-config');
    } catch (error) {
      console.log(error);
    }
  }

  async function saveEditFunction({newItems,index}){
    const data = {
      newItems: newItems,
      index: index
    };
    try{
      const response = await fetch(`/api/save-edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log("Saved Successfully");
    } catch (error) {
      console.log(error);
    }
  }

  const handleSave = async (index) => {
    let newItems = [...selectedItems];
    newItems.forEach((obj) => {
      obj.isdone = true;
    });
    const res = await saveEditFunction({newItems: newItems,index: index});
    setSelectedItems([...newItems]);
    setShow(false);
    setSelectedIndex(1000);
  };

  const handlePublish = async (index) => {
    let newItems = [...selectedItems];
    newItems.forEach((obj) => {
      obj.isdone = true;
    });
    const res = await publishFunction({newItems: newItems,index: index});
    setSelectedItems([...newItems]);
    setShow(false);
    setSelectedIndex(1000);
  };

  const DisplayNew = () => {
    const handleItemClick = (item) => {
      if (item === "Image") {
        document.getElementById("imageInput").click();
      } else if (item === "Text") {
        handleItemChange(null, "Text"); // Add a new text item
      } else if (item === "Blocks") {
        handleItemChange(null, "Blocks");
      }
    };

    return (
      <>
        {Items.map((Item) => (
          <div className="Item" onClick={() => handleItemClick(Item)}>
            <FontAwesomeIcon
              icon={faCirclePlus}
              style={{ paddingRight: "13%" }}
            />
            {Item}
          </div>
        ))}
        <div className="Last_Item">
          <div className="Last_Item_each" onClick={() => handleSave({ index: responseData })}>
            Save
          </div>
          <div className="Last_Item_each" onClick={() => handlePublish({ index: responseData })}>Publish</div>
        </div>
        <input
          id="imageInput"
          type="file"
          name = "image_name_in_form"
          accept="image/*"
          onChange={(e) => handleItemChange(e, "Image")}
          multiple
          style={{ display: "none" }}
        />
      </>
    );
  };

  function ImageEditor() {
    return (
      <>
        <div className="Item_1">
          <p>Width :</p>
          <div className="slider_1">
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].width || 50}
              onChange={(event) =>
                handleWidthChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              style={{ cursor: "pointer" }}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].width || 50}
              onChange={(event) =>
                handleWidthChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              className="InputField"
            />
          </div>
        </div>
        <div className="Item_1">
          <p>Height :</p>
          <div className="slider_1">
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].height || 50}
              onChange={(event) =>
                handleHeightChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              style={{ cursor: "pointer" }}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].height || 50}
              onChange={(event) =>
                handleHeightChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              className="InputField"
            />
          </div>
        </div>
        <div className="Item_1">
          <p>Border Radius :</p>
          <div className="slider_1">
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].borderRadius || 0}
              onChange={(event) =>
                handleBorderRadiusChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              style={{ cursor: "pointer" }}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={selectedItems[selectedIndex].borderRadius || 0}
              onChange={(event) =>
                handleBorderRadiusChange(
                  event.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              className="InputField"
            />
          </div>
        </div>
        <div className="Item">
          <div className="align">
            <label style={{ paddingRight: "5%" }}>Alignment :</label>
            <select
              value={selectedItems[selectedIndex].alignment || ""}
              onChange={(e) =>
                handleAlignmentChange(
                  e.target.value,
                  selectedIndex,
                  selectedItems[selectedIndex]
                )
              }
              className="InputField"
              style={{ width: "65px" }}
            >
              <option value="">None</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div
          className="Item"
          onClick={() => document.getElementById("ReplaceImage").click()}
        >
          <div className="align">Replace Image</div>
        </div>
        <input
          id="ReplaceImage"
          type="file"
          accept="image/*"
          onChange={(e) =>
            handlereplaceImage(e, selectedIndex, selectedItems[selectedIndex])
          }
          multiple
          style={{ display: "none" }}
        />
        <div
          className="Remove"
          onClick={() => handleremoveBlock(selectedIndex)}
        >
          Remove
        </div>
      </>
    );
  }

  function DisplayImage({ item, index }) {
    return (
      <div
        className="imageContainer"
        style={{ justifyContent: `${selectedItems[index].alignment}` }}
        key={index}
      >
        <img
          src={item.data}
          alt="selected_image"
          onClick={() => handleItemClick(index)}
          style={{
            border:
              selectedIndex === index
                ? `2px solid blue`
                : "2px solid transparent",
            width: `${selectedItems[index].width || "50"}vw`,
            height: `${selectedItems[index].height || "50"}vh`,
            borderRadius: `${selectedItems[index].borderRadius || 0}%`,
            cursor: "pointer",
          }}
        />
      </div>
    );
  }

  function DisplayText({ item, index }) {
    const [textContent, setTextContent] = useState(item.data || "");

    const handleTextChange = (value) => {
      setTextContent(value);
    };

    const handleChangesDone = () => {
      const newItems = [...selectedItems];
      newItems[index] = { ...item, data: textContent, isdone: true };
      setSelectedItems(newItems);
    };

    return (
      <>
        {item.isdone ? (
          <>
            <div
              className="ql-editor"
              onClick={() => handleItemClick(index)}
              style={{
                border:
                  selectedIndex === index
                    ? `2px solid blue`
                    : "2px solid transparent",
                height: "auto",
                margin: "0 0 5% 0",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: item.data }} />
            </div>
          </>
        ) : (
          <>
            <div className="textContainer" key={index}>
              <ReactQuill
                value={textContent}
                onChange={handleTextChange}
                modules={modules}
                // formats={formats}
                placeholder="Type your Text Here.."
              />
            </div>
            <button onClick={handleChangesDone}>Done</button>
          </>
        )}
      </>
    );
  }

  const [blocksData, setBlocksData] = useState({});

  useEffect(() => {
    const groupByBlockId = () => {
      const grouped = {};
      selectedItems.forEach((item, index) => {
        if (item.type === "Blocks" && typeof item.block_id !== "undefined") {
          if (!grouped[item.block_id]) {
            grouped[item.block_id] = [];
          }
          grouped[item.block_id].push({
            Block: item,
            index: index,
          });
        }
      });
      setBlocksData(grouped);
    };
    groupByBlockId();
  }, [selectedItems]);

  function DisplayBlocks({ blocks, block_id }) {
    return (
      <>
        <div
          key={block_id}
          className="Block-row"
        >
          {blocks.map((item) => (
            <div
              className="Block"
              onClick={() => handleItemClick(item.index)}
              style={{
                border:
                  selectedIndex === item.index
                    ? `2px solid blue`
                    : "2px solid transparent",
                height: "auto",
                backgroundColor: `${item.Block.bgcolor}`,
                color: `${item.Block.color}`,
              }}
            >
              {item.Block.Imagedata !== "" && (
                <div
                  className="imageContainer"
                  style={{
                    justifyContent: `${item.Block.image_align}`,
                  }}
                  key={item.index}
                >
                  <img
                    src={item.Block.Imagedata}
                    alt="selected_image"
                    style={{
                      width: `${item.Block.image_width}vw`,
                      height: `${item.Block.image_height}vw`,
                      borderRadius: `${item.Block.image_radius}%`,
                    }}
                  />
                </div>
              )}
              <DisplayBlockText
                key={item.index}
                item={item.Block}
                index={item.index}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  function DisplayBlockText({ item, index }) {
    const [textContent, setTextContent] = useState(item.data || "");

    const handleTextChange = (value) => {
      setTextContent(value);
    };

    const handleChangesDone = () => {
      const newItems = [...selectedItems];
      newItems[index] = { ...item, data: textContent, isdone: true };
      setSelectedItems(newItems);
    };

    return (
      <>
        {item.isdone ? (
          <>
            <div className="ql-editor" style={{ height: "auto" }}>
              <div dangerouslySetInnerHTML={{ __html: item.data }} />
            </div>
          </>
        ) : (
          <>
            <div className="textContainer" key={index}>
              <ReactQuill
                value={textContent}
                onChange={handleTextChange}
                modules={modules}
                // formats={formats}
                placeholder="Type your Text Here.."
              />
            </div>
            <button onClick={handleChangesDone}>Done</button>
          </>
        )}
      </>
    );
  }

  const handleEdit = (item, index) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, isdone: false };
    setSelectedItems(newItems);
  };

  function TextEditor({ item, index }) {
    return (
      <>
        <div className="Item" onClick={() => handleEdit(item, index)}>
          <div className="align">Edit Text</div>
        </div>
        <div className="Remove" onClick={() => handleremoveBlock(index)}>
          Remove
        </div>
      </>
    );
  }

  const handleBgColorChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, bgcolor: value };
    setSelectedItems(newItems);
  };

  const handletxtColorChange = (value, index, item) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...item, color: value };
    setSelectedItems(newItems);
  };

  const handleaddBlock = (item, index) => {
    setSelectedItems((prevItems) => {
      let before = prevItems.slice(0, index + 1);
      let after = prevItems.slice(index + 1);
      before.push({
        type: "Blocks",
        data: "",
        isdone: false,
        isFirst: false,
        block_id: item.block_id,
        bgcolor: "white",
        color: "black",
        Imagedata: "",
      });
      return [...before, ...after];
    });
  };

  const handleremoveBlock = (indexToRemove) => {
    const newItems = [...selectedItems];
    let secondIndex = 0;
    if (selectedItems[indexToRemove].isFirst === true) {
      let block_id = selectedItems[indexToRemove].block_id;
      if (blocksData[block_id].length > 1) {
        const index = selectedItems.findIndex(
          (obj) => obj.block_id === block_id
        );
        secondIndex = selectedItems.findIndex(
          (obj, idx) => obj.block_id === block_id && idx !== index
        );
      }
      newItems[secondIndex] = { ...selectedItems[secondIndex], isFirst: true };
    }
    const before = newItems.slice(0, indexToRemove);
    const after = newItems.slice(indexToRemove + 1);
    setSelectedItems([...before, ...after]);
  };

  function BlockEditor({ item, index }) {
    return (
      <>
        <p style={{ margin: "3%" }}>Color :</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="Item_2">
            Text :
            <input
              type="color"
              value={item.color}
              onChange={(event) =>
                handletxtColorChange(event.target.value, index, item)
              }
              className="InputField"
            />
          </div>
          <div className="Item_2">
            Block :
            <input
              type="color"
              value={item.bgcolor}
              onChange={(event) =>
                handleBgColorChange(event.target.value, index, item)
              }
              className="InputField"
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div
            className="Item_2"
            style={{ flexDirection: "column" }}
            onClick={() => handleaddBlock(item, index)}
          >
            <p>Add</p>
            <p>Block</p>
          </div>
          <div
            className="Item_2"
            style={{ flexDirection: "column", color: "red" }}
            onClick={() => handleremoveBlock(index)}
          >
            <p>Remove</p>
            <p>Block</p>
          </div>
        </div>
        <div className="Item" onClick={() => handleEdit(item, index)}>
          <div className="align">Edit Text</div>
        </div>
        <div
          className="Item"
          onClick={() => document.getElementById("TakeimageInput").click()}
        >
          <div className="align">Add image</div>
        </div>
        <input
          id="TakeimageInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleaddImage(e, index, item)}
          multiple
          style={{ display: "none" }}
        />
        {item.Imagedata !== "" && (
          <>
            <div className="Item_1">
              <div className="align">
                <label style={{ paddingRight: "5%" }}> Width :</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedItems[selectedIndex].image_width}
                  onChange={(event) =>
                    handleBlockImageWidth(
                      event.target.value,
                      selectedIndex,
                      selectedItems[selectedIndex]
                    )
                  }
                  className="InputField"
                />
              </div>
            </div>
            <div className="Item_1">
              <div className="align">
                <label style={{ paddingRight: "5%" }}> Height :</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedItems[selectedIndex].image_height}
                  onChange={(event) =>
                    handleBlockImageHeight(
                      event.target.value,
                      selectedIndex,
                      selectedItems[selectedIndex]
                    )
                  }
                  className="InputField"
                />
              </div>
            </div>
            <div className="Item_1">
              <div className="align">
                <label style={{ paddingRight: "5%" }}> Border Radius :</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedItems[selectedIndex].image_radius}
                  onChange={(event) =>
                    handleBlockImageRadius(
                      event.target.value,
                      selectedIndex,
                      selectedItems[selectedIndex]
                    )
                  }
                  className="InputField"
                />
              </div>
            </div>
            <div className="Item_1">
              <div className="align">
                <label style={{ paddingRight: "5%" }}>Alignment :</label>
                <select
                  value={selectedItems[selectedIndex].image_align}
                  onChange={(e) =>
                    handleBlockImageAlignment(
                      e.target.value,
                      selectedIndex,
                      selectedItems[selectedIndex]
                    )
                  }
                  className="InputField"
                  style={{ width: "65px" }}
                >
                  <option value="">None</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="pageContainer">
      <div className="MainContent">
        {selectedItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === "Image" && (
              <DisplayImage item={item} index={index} />
            )}
            {item.type === "Text" && (
              <DisplayText key={index} item={item} index={index} />
            )}
            {item.type === "Blocks" &&
              blocksData[item.block_id] &&
              item.isFirst && (
                <DisplayBlocks
                  blocks={blocksData[item.block_id]}
                  block_id={item.block_id}
                />
              )}
          </React.Fragment>
        ))}
      </div>
      {!Show && (
        <div className="arrow" onClick={() => setShow(true)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </div>
      )}
      {Show && (
        <>
          <div className="arrow" onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div className="container">
            <div className="Tabs">
              {New ? (
                <>
                  <div className="edit" onClick={() => setNew(true)}>
                    New
                  </div>
                  <div className="new" onClick={() => setNew(false)}>
                    Edit
                  </div>
                </>
              ) : (
                <>
                  <div className="new" onClick={() => setNew(true)}>
                    New
                  </div>
                  <div className="edit" onClick={() => setNew(false)}>
                    Edit
                  </div>
                </>
              )}
            </div>
            {!New && selectedIndex >= selectedItems.length && (
              <div className="defaultEdit">
                <p>Please select the </p>
                <p>item to edit !</p>
              </div>
            )}
            {!New &&
              selectedIndex < selectedItems.length &&
              selectedItems[selectedIndex].type === "Image" && <ImageEditor />}
            {!New &&
              selectedIndex < selectedItems.length &&
              selectedItems[selectedIndex].type === "Text" && (
                <TextEditor
                  item={selectedItems[selectedIndex]}
                  index={selectedIndex}
                />
              )}
            {!New &&
              selectedIndex < selectedItems.length &&
              selectedItems[selectedIndex].type === "Blocks" && (
                <BlockEditor
                  item={selectedItems[selectedIndex]}
                  index={selectedIndex}
                />
              )}
            {New && <DisplayNew />}
          </div>
        </>
      )}
    </div>
  );
}
