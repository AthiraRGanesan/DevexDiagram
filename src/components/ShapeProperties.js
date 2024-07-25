import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Button, Input } from 'antd';

function ShapeProperties (props) {

    <Drawer
    title="Edit Shape"
    placement="right"
    onClose={() => props.setDrawerOpen(false)}
    open={props.isDrawerOpen}
  >
    <div style={{ width: 250, padding: 20 }}>
      <Input
        label="Text"
        name="text"
        value={props.formData.text}
        onChange={props.handleFormChange}
        placeholder="Shape text"
        fullWidth
        margin="normal"
      />
      <Button type="primary" onClick={props.handleFormSubmit}>
        Save
      </Button>
    </div>
  </Drawer>

}

export default ShapeProperties;