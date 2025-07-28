import React from 'react';

// Import all block components
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { ButtonBlock } from './ButtonBlock';
import { ImageBlock } from './ImageBlock';
import { SpacerBlock } from './SpacerBlock';
import { QuizQuestionBlock } from './QuizQuestionBlock';

// Block component registry
export const BLOCK_REGISTRY = {
  'heading': HeadingBlock,
  'text': TextBlock,
  'button': ButtonBlock,
  'image': ImageBlock,
  'spacer': SpacerBlock,
  'quiz-question': QuizQuestionBlock,
  'quiz-step': QuizQuestionBlock, // Alias for advanced quiz step
  
  // Placeholder components for other block types
  'rich-text': ({ content = 'Rich text content', ...props }: any) => (
    <div dangerouslySetInnerHTML={{ __html: content }} {...props} />
  ),
  'quiz-intro': ({ title = 'Quiz Title', subtitle = 'Quiz subtitle', ...props }: any) => (
    <div className="text-center p-8" {...props}>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-6">{subtitle}</p>
      <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">Start Quiz</button>
    </div>
  ),
  'quiz-progress': ({ currentStep = 1, totalSteps = 10, ...props }: any) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4" {...props}>
      <div 
        className="bg-blue-500 h-2 rounded-full" 
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  ),
  'quiz-result': ({ resultTitle = 'Your Result', ...props }: any) => (
    <div className="text-center p-8 bg-green-50 rounded-lg" {...props}>
      <h2 className="text-3xl font-bold text-green-800 mb-4">{resultTitle}</h2>
      <p className="text-green-600">Congratulations on completing the quiz!</p>
    </div>
  ),
  'product-offer': ({ productName = 'Product Name', salePrice = '$99', ...props }: any) => (
    <div className="border rounded-lg p-6 text-center" {...props}>
      <h3 className="text-2xl font-bold mb-2">{productName}</h3>
      <p className="text-3xl text-green-600 font-bold">{salePrice}</p>
      <button className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4">Buy Now</button>
    </div>
  ),
  'testimonials': ({ title = 'What Our Customers Say', ...props }: any) => (
    <div className="p-6" {...props}>
      <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="italic">"Great product!"</p>
          <p className="text-sm text-gray-600 mt-2">- Happy Customer</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="italic">"Highly recommended!"</p>
          <p className="text-sm text-gray-600 mt-2">- Satisfied User</p>
        </div>
      </div>
    </div>
  ),
  'urgency-timer': ({ title = 'Limited Time Offer', ...props }: any) => (
    <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg" {...props}>
      <h3 className="text-xl font-bold text-red-800 mb-4">{title}</h3>
      <div className="text-3xl font-mono text-red-600">23:59:47</div>
    </div>
  ),
  'faq-section': ({ title = 'Frequently Asked Questions', ...props }: any) => (
    <div className="p-6" {...props}>
      <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium">How does it work?</h4>
          <p className="text-gray-600 mt-2">This is how our product works...</p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium">Is there a guarantee?</h4>
          <p className="text-gray-600 mt-2">Yes, we offer a 30-day money-back guarantee.</p>
        </div>
      </div>
    </div>
  )
};

// Helper function to render a block
export const renderBlock = (blockType: string, props: any = {}) => {
  const BlockComponent = BLOCK_REGISTRY[blockType as keyof typeof BLOCK_REGISTRY];
  
  if (!BlockComponent) {
    return (
      <div className="border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
        <p>Unknown block type: {blockType}</p>
        <p className="text-sm">Add this block to the registry</p>
      </div>
    );
  }

  return React.createElement(BlockComponent, props);
};

// Helper function to get available block types
export const getAvailableBlockTypes = () => {
  return Object.keys(BLOCK_REGISTRY);
};

// Helper function to check if a block type exists
export const isValidBlockType = (blockType: string) => {
  return blockType in BLOCK_REGISTRY;
};

export default BLOCK_REGISTRY;