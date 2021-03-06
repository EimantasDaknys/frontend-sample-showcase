/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { IModelConnection, ViewState } from "@bentley/imodeljs-frontend";
import { ViewportAndNavigation } from "./ViewportAndNavigation";
import { ViewSetup } from "../../api/viewSetup";
import { StartupComponent } from "../Startup/Startup";

export interface ReloadableViewportProps {
  iModelName: string;
  getCustomViewState?: (imodel: IModelConnection) => Promise<ViewState>;
  onIModelReady?: (imodel: IModelConnection) => void;
}

export interface ReloadableViewportState {
  /** iModel whose contents should be displayed in the viewport */
  imodel?: IModelConnection;
  /** View state to use when the viewport is first loaded */
  viewState?: ViewState;
}

/** Renders viewport, toolbar, and associated elements */
export class ReloadableViewport extends React.PureComponent<ReloadableViewportProps, ReloadableViewportState> {

  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {};
  }

  public render() {
    let ui: React.ReactNode;

    if (!this.state.imodel || !this.state.viewState)
      ui = <StartupComponent iModelName={this.props.iModelName} onIModelReady={this._onIModelReady} />;
    else
      ui = <ViewportAndNavigation imodel={this.state.imodel} viewState={this.state.viewState} />;

    return (
      <>
        {ui}
      </>
    );
  }

  public componentDidUpdate(prevProps: ReloadableViewportProps, prevState: ReloadableViewportState) {
    if (this.state.imodel && prevProps.iModelName !== this.props.iModelName) {
      this.setState({ imodel: undefined, viewState: undefined });
      return;
    }

    if (this.state.imodel && this.state.viewState && prevState.imodel !== this.state.imodel) {
      if (this.props.onIModelReady)
        this.props.onIModelReady(this.state.imodel);
    }
  }

  private _onIModelReady = async (imodel: IModelConnection) => {
    const viewState = (this.props.getCustomViewState) ? await this.props.getCustomViewState(imodel) : await ViewSetup.getDefaultView(imodel);
    this.setState({ imodel, viewState });
  }
}
