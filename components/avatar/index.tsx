import { CSSProperties, RefObject, useEffect, useState } from 'react';
import { Background } from '@/components';
import { WidgetShape, WidgetType, WrapperShape } from '@/enums';
import { AvatarOption, Widget } from '@/types';
import { AVATAR_LAYER, NONE } from '@/constants';
import { analyzeSVGColors, applyDynamicVariations, applyDynamicVariationsDOM, svgAnalysisCache } from '@/utils';
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
            let skinColor: string | undefined;
            let hairColor: string | undefined;



            const svgElements = svgRawList.map((svgContent, i) => {
                if (!svgContent) {
                    return '';
                }
                const isFaceWidget = sortedList[i][0] === WidgetType.Face;
                
                // translate(175, 243) translate(138, 233)
                const faceTransform = isFaceWidget ? `translate(138, 233)` : '';
                // const hairTransform = 'isFroBun' ? 'translate(20, -95)' : '';
                // const curlYbOB = 'isCurlyBob' ? 'translate(-55, 20)' : '';                

                const transformFace = isFaceWidget ? `transform="${faceTransform}"` : '';
                // const transformHair = isCurlyShort ? `transform="${hairTransform}"` : '';

                const [widgetType, widget] = sortedList[i];
                let widgetFillColor = widget.fillColor;

                let svgIdentifier = `avatar-${widgetType}-${widget.shape}-${widget.fillColor}`;
                
                if ((!svgAnalysisCache[svgIdentifier] || widget.fillColor !== avatarOption.widgets[widgetType]?.fillColor) && widgetType === WidgetType.Hair) {
                    console.log('SVG IDENTIFIER', svgIdentifier)
                    svgAnalysisCache[svgIdentifier] = analyzeSVGColors(svgContent);
                }


                if (widgetType === WidgetType.Face) {
                    skinColor = widgetFillColor;
                }

                if (widgetType === WidgetType.Hair) {
                    hairColor = widgetFillColor
                    const { baseColor, variations } = svgAnalysisCache[svgIdentifier];
                    let newColors = applyDynamicVariationsDOM(svgContent, hairColor || baseColor, variations);
                    return `<g id="avatar-${sortedList[i][0]}" ${transformFace}>${newColors}</g>`;
                }

                const svgXmlContent = svgContent
                    .slice(svgContent.indexOf('>', svgContent.indexOf('<svg')) + 1)
                    .replace('</svg>', '')
                    .replaceAll(/\$fillColor/g, skinColor || 'transparent')

                return `<g id="avatar-${sortedList[i][0]}" ${transformFace}>${svgXmlContent}</g>`;

            });

            setSvgContent(`
                <svg        
                    width="${avatarSize}"
                    height="${avatarSize}"        
                    viewBox="0 0 ${avatarSize * 6.6} ${avatarSize * 6.6}"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g transform="translate(100, 95)"> 
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
        <div className={`${styles.avatar} ${trueShape ? styles[trueShape] : ''}`} ref={colorAvatarRef} style={{ width: avatarSize, height: avatarSize, ...style }}>
            <Background color={avatarOption.background.color} />
            <div className={styles.avatarPayload} dangerouslySetInnerHTML={{ __html: svgContent }}></div>
        </div>
    );
}


export default Avatar