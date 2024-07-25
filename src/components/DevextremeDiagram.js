import React, { useEffect, useRef, useState } from 'react';
import Diagram, { Nodes, Edges } from 'devextreme-react/diagram';
import { Drawer, Button, Input } from 'antd';
import { Position } from 'devextreme-react/cjs/autocomplete';


function DevexDiagram () {
    const diagramRef = useRef();
    const [selectedShape, setSelectedShape] = useState(null);
    const [formData, setFormData] = useState({ text: '' });
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [nodeItemDataSource, setNodeItemDataSource] = useState([]);
    const [edgeItemDataSource, setEdgeItemDataSource] = useState([]);
    const [diagramJson, setDiagramJson] = useState(null);
    //const [nodeItemShape, setNodeItemShape] = useState([]);
    const diagram = diagramRef.current?.instance();
    //const itemArray = [];

    useEffect(() => {
      if (diagramRef.current) {
          const diagram = diagramRef.current.instance();
          diagram.on("itemClick", handleItemClick);
      }
  }, []);

    const saveDiagramAsJson = () => {    
        //const diagram = diagramRef.current.instance(); 
        const diagramJson = diagram.export();
        setDiagramJson(diagramJson);
        console.log(">>>>>>>>>>>> diagramJson", diagramJson);
    }

    const handleItemClick = (e) => {
      console.log(">>>>>>>>>>>> handleItemClick e", e);
        if (e.item.itemType === "shape") {
          setSelectedShape(e.item);
          setFormData({
            text: e.item.text || '',
          });
          setDrawerOpen(true); // Open the sidebar when a shape is clicked
        }
      };
    
      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleFormSubmit = () => {
        if (selectedShape) {
            const diagram = diagramRef.current.instance();
            const shape = diagram.getItemById(selectedShape.id);

            if (shape) {
                diagram.beginUpdate();
                shape.text = formData.text;

                // Update the data source
                const updatedDataSource = nodeItemDataSource.filter(item => item.id && item.id !== selectedShape.id);
                updatedDataSource.push({ id: selectedShape.id, text: formData.text, type: selectedShape.type, position: { x: selectedShape.position.x, y: selectedShape.position.y }});

                setNodeItemDataSource(updatedDataSource);
                diagram.endUpdate();

                // Re-export the diagram JSON
                const updatedJson = diagram.export();
                setDiagramJson(updatedJson);
                console.log("Updated diagram JSON:", updatedJson);
            }
            setDrawerOpen(false); // Close the drawer after saving changes
        }
    };

    function linkFromLineEndExpr() {
      return 'none';
    }
    
    function linkToLineEndExpr() {
      return 'none';
    }

    console.log(">>>>>>>>>>>>>> nodeItemDataSource", nodeItemDataSource);
    return (
      <>
      <div>
            <Diagram
                id="diagram"
                ref={diagramRef}
                onItemClick={handleItemClick}
            >
              <Nodes
                dataSource={nodeItemDataSource}
                //typeExpr={nodeItemShape.type}
                textExpr="text"
                keyExpr="id"
                // widthExpr={itemWidthExpr}
                // heightExpr={itemHeightExpr}
                // textStyleExpr={itemTextStyleExpr}
                // styleExpr={itemStyleExpr}
              >
              </Nodes>
              <Edges dataSource={edgeItemDataSource} fromLineEndExpr={linkFromLineEndExpr} toLineEndExpr={linkToLineEndExpr} />
            </Diagram>
            <button onClick={saveDiagramAsJson}>Save as JSON</button>

            <Drawer
        title="Edit Shape"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <div style={{ width: 250, padding: 20 }}>
          <Input
            label="Text"
            name="text"
            value={formData.text}
            onChange={handleFormChange}
            placeholder="Shape text"
            fullWidth
            margin="normal"
          />
          <Button type="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </div>
      </Drawer>

        </div>
        </>
    );
};

export default DevexDiagram;