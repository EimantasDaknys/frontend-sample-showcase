/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import "common/samples-common.scss";
import { ControlPane } from "Components/ControlPane/ControlPane";
import { ReloadableViewport } from "Components/Viewport/ReloadableViewport";
import * as React from "react";
import { IModelApp, IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";
import { Toggle } from "@bentley/ui-core";
import RealityDataApp from "./RealityDataApp";

interface RealityDataState {
  imodel?: IModelConnection;
  showRealityData: boolean;
}

export default class RealityDataUI extends React.Component<{ iModelName: string, iModelSelector: React.ReactNode }, RealityDataState> {
  /** Creates a sample instance */
  constructor(props?: any, context?: any) {
    super(props, context);
    this.state = {
      showRealityData: true,
    };
  }

  public componentDidUpdate(_prevProps: {}, prevState: RealityDataState) {
    if (prevState.showRealityData !== this.state.showRealityData) {
      const vp = IModelApp.viewManager.selectedView;
      if (vp)
        RealityDataApp.toggleRealityModel(this.state.showRealityData, vp, this.state.imodel!);
    }
  }

  // Create the react components for the toggle
  private createToggle(label: string, info: string) {
    const show: boolean = this.state.showRealityData;

    const element = <Toggle isOn={show} onChange={async (checked: boolean) => this._onChangeToggle(checked)} />;
    return (
      <div className="sample-options-2col" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <>
          <span><span style={{ marginRight: "1em" }} className="icon icon-help" title={info}></span>{label}</span>
          {element}
        </>
      </div>
    );
  }

  // Handle changes to the toggle.
  private _onChangeToggle = async (checked: boolean) => {
    this.setState({ showRealityData: checked });
  }

  /**
   * This callback will be executed by ReloadableViewport once the iModel has been loaded.
   * The reality models will default to on.
   */
  private _onIModelReady = (imodel: IModelConnection) => {
    this.setState({ imodel });

    IModelApp.viewManager.onViewOpen.addOnce((_vp: ScreenViewport) => {
      this.setState({ imodel, showRealityData: true });
    });
  }

  /** The sample's render method */
  public render() {
    return (
      <>
        { /* Display the instructions and iModelSelector for the sample on a control pane */}
        <ControlPane instructions="Use the toggle below for displaying the reality data in the model." controls={this.createToggle("Reality Data", "Toggle showing the reality data in the model.")} iModelSelector={this.props.iModelSelector}></ControlPane>
        { /* Viewport to display the iModel */}
        <ReloadableViewport onIModelReady={this._onIModelReady} iModelName={this.props.iModelName} />
      </>
    );
  }
}
