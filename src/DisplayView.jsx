import React, { useState } from "react";
import { useEffect } from "react";
import "./AddNew.css";

export default function DisplayView({selectedItems}) {
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
      console.log(selectedItems);
      setBlocksData(grouped);
    };
    groupByBlockId();
  }, [selectedItems]);

  function DisplayImage({ item, index }) {
    return (
      <div
        className="imageContainer"
        style={{ justifyContent: `${item.alignment}` }}
        key={index}
      >
        <img
          src={item.data}
          alt="selected_image"
          style={{
            width: `${item.width || "50"}vw`,
            height: `${item.height || "50"}vh`,
            borderRadius: `${item.borderRadius || 0}%`,
          }}
        />
      </div>
    );
  }

  function DisplayText({ item }) {
    return (
      <div
        className="ql-editor"
        style={{
          height: "auto",
          margin: "0 0 5% 0",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: item.data }} />
      </div>
    );
  }

  function DisplayBlocks({ blocks, block_id }) {
    return (
      <>
        <div key={block_id} className="Block-row">
          {blocks.map((item) => (
            <div
              className="Block"
              style={{
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
              <DisplayText key={item.index} item={item.Block} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      {selectedItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.type === "Image" && <DisplayImage item={item} index={index} />}
          {item.type === "Text" && <DisplayText key={index} item={item} />}
          {console.log(blocksData)}
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
  );
}
