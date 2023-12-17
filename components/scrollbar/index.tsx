import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SectionWrapper, ColorList, WrapperShapeItem } from '@/components';
import { AvatarOption, AvatarWidgets } from '@/types';
import { BeardShape, WidgetShape, WidgetType } from '@/enums';
import { getWidgets } from '@/utils';
import { AVATAR_LAYER, SETTINGS } from '@/constants';

import styles from './style.module.scss'

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}
const sectionList = Object.values(WidgetType);

const Scrollbar = (props: IProps) => {
    const { avatarOption, setAvatarOption } = props;
    const [updatedSvgContent, setUpdatedSvgContent] = useState(new Map());
    const scrollWrapper = useRef(null);
    const [sections, setSections] = useState<{
        widgetType: WidgetType
        widgetList: {
            widgetType: WidgetType
            widgetShape: WidgetShape
            svgRaw: any
        }[]
    }[]>([]);

    useEffect(() => {
        (async () => {
            const a = await Promise.all(
                sectionList.map((section) => {
                    return getWidgets(section);
                })
            );
            const updatedSections = sectionList.map((li, i) => {
                return {
                    widgetType: li,
                    widgetList: a[i],
                };
            });
            setSections(updatedSections);
        })();
        
        
    }, []);

     useEffect(() => {
        const fetchSvgContent = async () => {
            const sectionsWithSvg = await Promise.all(
                sections.map(async (section) => {
                    const widgetsWithSvg = await Promise.all(
                        section.widgetList.map(async (widget) => {
                            try {
                                const svgResponse = await fetch(widget.svgRaw.src);
                                const svgContent = await svgResponse.text();
                                return { ...widget, svgRaw: svgContent };
                            } catch (error) {
                                console.error("Error fetching SVG:", error);
                                return widget; 
                            }
                        })
                    );
                    return { ...section, widgetList: widgetsWithSvg };
                })
            );
            setSections(sectionsWithSvg);
        };

        if (sections.some(section => section.widgetList.some(widget => typeof widget.svgRaw === 'object'))) {
            fetchSvgContent();
        }
     }, [sections]);
    
    useEffect(() => {
        // Function to update SVG content with selected color
        const updateSvgContentColor = (widgetType: WidgetType, fillColor: string) => {
            return sections.map(section => {
                if (section.widgetType === widgetType) {
                    return {
                        ...section,
                        widgetList: section.widgetList.map(widget => {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(widget.svgRaw, "image/svg+xml");
                            const paths = xmlDoc.querySelectorAll('path');
                            paths.forEach(path => {
                                // Update fill color
                                path.setAttribute('fill', fillColor);
                            });
                            const serializer = new XMLSerializer();
                            return {
                                ...widget,
                                svgRaw: serializer.serializeToString(xmlDoc.documentElement),
                            };
                        })
                    };
                }
                return section;
            });
        };

        // Updating SVGs whenever avatarOption changes
        const updatedSections = sections.map(section => {
            return {
                ...section,
                widgetList: section.widgetList.map(widget => {
                    if (avatarOption.widgets?.[section.widgetType]?.fillColor) {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(widget.svgRaw, "image/svg+xml");
                        const paths = xmlDoc.querySelectorAll('path');
                        paths.forEach(path => {
                            const fillColor = avatarOption.widgets[section.widgetType]?.fillColor ?? '';
                            path.setAttribute('fill', fillColor);
                        });
                        const serializer = new XMLSerializer();
                        return {
                            ...widget,
                            svgRaw: serializer.serializeToString(xmlDoc.documentElement),
                        };
                    }
                    return widget;
                })
            };
        });
        setSections(updatedSections);

    }, [avatarOption, sections]);


    const onSetWidgetColor = (widgetType: WidgetType, fillColor: string) => {
        if (avatarOption.widgets?.[widgetType]) {
            setAvatarOption({
                ...avatarOption,
                widgets: {
                    ...avatarOption.widgets,
                    [widgetType]: {
                        ...avatarOption.widgets?.[widgetType],
                        fillColor,
                    },
                },
            })
        }
    }

    const onSetSwitchWidget = (widgetType: WidgetType, widgetShape: WidgetShape) => {
        if (widgetShape && avatarOption.widgets?.[widgetType]) {
            setAvatarOption({
                ...avatarOption,
                widgets: {
                    ...avatarOption.widgets,
                    [widgetType]: {
                        ...avatarOption.widgets?.[widgetType],
                        shape: widgetShape,
                        ...(widgetShape === BeardShape.Fuzz
                            ? { zIndex: AVATAR_LAYER['smile'].zIndex - 1 }
                            : undefined),
                    },
                },
            })
        }
    }

    const getWidgetColor = (type: string) => {
        if (
            type === WidgetType.Face ||
            type === WidgetType.Hair
        ) {
            return avatarOption.widgets[type]?.fillColor
        } else return ''
    }
    if (!sections) {
        return null;
    }
    return (
        <div ref={scrollWrapper} style={{ position: 'relative', overflowY: 'auto', overflowX: 'hidden' }} className={styles.configuratorScroll}>
            <div className={styles.configurator}>
                <SectionWrapper title='border shape'>
                    <WrapperShapeItem avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
                </SectionWrapper>

                <SectionWrapper title='background color'>
                    <ColorList avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
                </SectionWrapper>
                {sections.map((s) => (
                    <SectionWrapper key={s.widgetType} title={(`${s.widgetType}`)}>
                        {
                            s.widgetType === WidgetType.Hair ||
                                s.widgetType === WidgetType.Face ? (
                                <details className={`${styles.colorPicker} ${s.widgetType === WidgetType.Face ? 'open' : ''}`}>
                                    <summary className="color">{('colors')}</summary>
                                    <ul className={styles.colorList}>
                                        {SETTINGS[s.widgetType === WidgetType.Face ? 'skinColors' : 'commonColors'].map(
                                            (fillColor) => (
                                                <li
                                                    key={fillColor}
                                                    className={styles.colorListItem}
                                                    onClick={() => onSetWidgetColor(s.widgetType, fillColor)}
                                                >
                                                    <div style={{ background: fillColor }} className={`${styles.bgColor} ${fillColor === getWidgetColor(s.widgetType) ? styles.active : ''}`} />
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </details>
                            ) : null
                        }

                        <ul className={styles.widgetList}>
                            {s.widgetList.map((it) => {
                                return (
                                    <li
                                        key={it.widgetShape}
                                        className={`${styles.listItem} ${it.widgetShape === avatarOption.widgets?.[s.widgetType]?.shape ? styles.selected : ''}`}
                                        onClick={() => onSetSwitchWidget(s.widgetType, it.widgetShape)}
                                        dangerouslySetInnerHTML={{ __html: it.svgRaw }}
                                    />
                                        
                                )
                            })}
                        </ul>
                    </SectionWrapper>
                ))}
            </div>

        </div>
    )
}

export default Scrollbar;