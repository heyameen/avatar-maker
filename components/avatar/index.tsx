import { CSSProperties, RefObject, useEffect, useState } from 'react';
import { Background } from '@/components';
import { WidgetShape, WidgetType, WrapperShape } from '@/enums';
import { AvatarOption, Widget } from '@/types';
import { AVATAR_LAYER, NONE } from '@/constants';
import { widgetData } from '@/utils/assets-data';
import styles from './style.module.scss';

interface AvatarProps {
    option: AvatarOption,
    size: 280,
    style: CSSProperties,
    colorAvatarRef: RefObject<HTMLDivElement>
}
const Avatar = (props: AvatarProps) => {
    const { option: avatarOption, size: avatarSize, style, colorAvatarRef } = props;
    const [svgContent, setSvgContent] = useState('');

    useEffect(() => {
        (async () => {
            const sortedList = Object.entries(avatarOption.widgets).sort(
                ([prevShape, prev], [nextShape, next]) => {
                    const prevZIndex = prev.zIndex ?? AVATAR_LAYER[prevShape as WidgetType]?.zIndex ?? 0;
                    const nextZIndex = next.zIndex ?? AVATAR_LAYER[nextShape as WidgetType]?.zIndex ?? 0;
                    return prevZIndex - nextZIndex;
                }
            );

            const getWidgetSvg = async (widgetType: WidgetType, opt: Widget<WidgetShape>) => {
                if (opt.shape !== NONE && widgetData?.[widgetType]?.[opt.shape]) {
                    console.log(await widgetData[widgetType][opt.shape]())
                    const response = await fetch(`${(await widgetData[widgetType][opt.shape]()).default.src}`);
                    return response.text();
                }
                return '';
            };

            const promises = sortedList.map(async ([widgetType, opt]) => {
                return getWidgetSvg(widgetType as WidgetType, opt);
            });

            const svgRawList = await Promise.all(promises);
            console.log('SVG RAW LIST', svgRawList)
            let skinColor: string | undefined;

            const svgElements = svgRawList.map((svgContent, i) => {
                if (!svgContent) {
                    // Handle the error for this widget.
                    console.error(`SVG content for widget ${sortedList[i][0]} not found.`);
                    return '';
                }

                const [widgetType, widget] = sortedList[i];
                let widgetFillColor = widget.fillColor;

                if (widgetType === WidgetType.Face) {
                    skinColor = widgetFillColor;
                }

                const isFaceWidget = sortedList[i][0] === WidgetType.Face;
                const faceTransform = isFaceWidget ? 'translate(130, 230)' : ''; // Adjust the Y value as needed.

                const svgXmlContent = svgContent
                    .slice(svgContent.indexOf('>', svgContent.indexOf('<svg')) + 1)
                    .replace('</svg>', '')
                    .replaceAll('$fillColor', widgetFillColor || 'transparent');

                const transformAttribute = isFaceWidget ? `transform="${faceTransform}"` : '';


                return `<g id="avatar-${sortedList[i][0]}" ${transformAttribute}>${svgXmlContent}</g>`;
            });
            console.log('LER', svgElements)
            // -110 -180
            setSvgContent(`
                <svg        
                    width="${avatarSize}"
                    height="${avatarSize}"        
                    viewBox="0 0 ${avatarSize * 6} ${avatarSize * 6}"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <g transform="translate(100, -180)"> 
                        ${svgElements.join('')}
                    </g>
                </svg>
            `);
        })();
    }, [avatarOption, avatarSize])

    const getWrapperShapeClassName = () => {
        return {
            [WrapperShape.Circle]:
                avatarOption.wrapperShape === WrapperShape.Circle,
            [WrapperShape.Square]:
                avatarOption.wrapperShape === WrapperShape.Square,
            [WrapperShape.Squircle]:
                avatarOption.wrapperShape === WrapperShape.Squircle,
        }
    }
    const shapeClassNames = getWrapperShapeClassName();
    const trueShape = Object.keys(shapeClassNames).find((shape: string) => {
        return shapeClassNames[shape as WrapperShape];
    });

    return (
        <div className={`${styles.avatar} ${ trueShape ? styles[trueShape] : ''}`} ref={colorAvatarRef} style={{ width: avatarSize, height: avatarSize, ...style }}>
            <Background color={avatarOption.background.color} />
            <div className={styles.avatarPayload} dangerouslySetInnerHTML={{ __html: svgContent }}></div>
        </div>
    );
}


export default Avatar