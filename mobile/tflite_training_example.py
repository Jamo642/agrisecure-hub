# Example: TensorFlow model training and export to TFLite
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Dummy data: Replace with real images and labels
num_classes = 3
input_shape = (128, 128, 3)
X_train = np.random.rand(100, *input_shape)
y_train = np.random.randint(0, num_classes, 100)

# Model definition
model = keras.Sequential([
    layers.Input(shape=input_shape),
    layers.Conv2D(16, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=5)

# Export to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open('disease_model.tflite', 'wb') as f:
    f.write(tflite_model)

print('Model exported to disease_model.tflite')
