import './main.pcss';

import React, { ChangeEvent, FunctionComponent, useCallback } from 'react';
import { isEdge, resolveAssetUrl } from '@/Helpers/environment';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Header from '@/Components/Header';
import { IAppState } from '@/store';
import PluginActions from '@/Store/Plugin';
import PresetSelectContainer from '@/Containers/PresetSelectContainer';
import Switch from '@material-ui/core/Switch';
import classnames from 'classnames';
import { navigate } from 'hookrouter';

declare var browser: any;

const errorIcon = require('./assets/error_icon.svg');

const MainView: FunctionComponent = () => {
    const enabled = useSelector<IAppState, boolean>(
        (state) => state.plugin.enabled
    );
    const enabledSwitching = useSelector<IAppState, boolean>(
        (state) => state.plugin.switching
    );
    const errorReason = useSelector<IAppState, string | undefined>(
        (state) => state.plugin.errorReason
    );

    const dispatch = useDispatch();
    const setEnabled = useCallback(
        (enable: boolean) =>
            dispatch(PluginActions.enablePlugin.started({ enable })),
        [dispatch]
    );

    return (
        <div className="main-page">
            <Header
                title="Pixel Grid"
                githubLink="https://github.com/pixel-grid"
            />

            {!errorReason && (
                <>
                    <section className="main-page__hero">
                        <div className="main-page__hero-title">Enable grid</div>
                        <div className="main-page__hero-value">
                            <Switch
                                disabled={enabledSwitching}
                                checked={enabled}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => setEnabled(event.target.checked)}
                            />
                        </div>
                    </section>

                    <section
                        className={classnames('main-page__list', {
                            'main-page__list_disabled':
                                enabledSwitching || !enabled
                        })}
                    >
                        <PresetSelectContainer />
                    </section>
                </>
            )}

            {errorReason && (
                <section className="main-page__error">
                    <img
                        src={resolveAssetUrl(errorIcon)}
                        className="main-page__error-icon"
                    />
                    <p className="main-page__error-text">
                        Pixel Grid does not support this page.
                    </p>
                    <a
                        className="main-page__error-link"
                        target="_blank"
                        href="https://github.com/pixel-grid/pixelgrid/wiki/Why-the-browser-extension-doesn't-work-on-some-pages"
                    >
                        What is the reason?
                    </a>
                </section>
            )}

            <section className="main-page__bottom">
                <div className="main-page__bottom-buttons">
                    <Button
                        color="secondary"
                        onClick={() =>
                            !isEdge()
                                ? navigate('/presets')
                                : browser.runtime.openOptionsPage()
                        }
                    >
                        Edit presets
                    </Button>
                </div>

                <p className="main-page__bottom-author">
                    Created by{' '}
                    <a
                        className="main-page__bottom-author-link"
                        href="https://github.com/pixel-grid"
                        target="_blank"
                    >
                        Sergey Zwezdin
                    </a>
                </p>
            </section>
        </div>
    );
};

export default MainView;
